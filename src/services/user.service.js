const { pool } = require('../dao/mysql-db')
const logger = require('../util/logger')

let userService = {
    getUsers: (callback) => {
        logger.info('Fetching users from the database...')
        pool.query(
            'SELECT id, firstName, lastName, isActive, emailAdress, phoneNumber, street, city FROM user',
            (error, result) => {
                if (error) {
                    logger.error('Error fetching users:', error)
                    callback(error, null)
                } else {
                    logger.info('Users fetched successfully.')
                    callback(null, result)
                }
            }
        )
    },

    getUserById: (userId, includePrivateData, callback) => {
        logger.info(`Fetching user with ID ${userId} from the database...`)
        pool.query(
            'SELECT * FROM user WHERE id = ?',
            [userId],
            (error, result) => {
                if (error) {
                    logger.error('Error executing query:', error)
                    callback(error, null)
                } else {
                    let data = result.length > 0 ? result[0] : null
                    if (data == null) {
                        logger.warn(`User with ID ${userId} not found.`)
                        callback(null, null)
                        return
                    }
                    if (!includePrivateData) {
                        delete data.password
                    }
                    logger.info(`User with ID ${userId} fetched successfully.`)
                    callback(null, data)
                }
            }
        )
    },

    getUserByField: (queryParams, includePrivateData, callback) => {
        logger.info('Fetching user by field from the database...')
        let sqlQuery =
            'SELECT id, firstName, lastName, isActive, emailAdress, phoneNumber, roles, street, city FROM user'
        const sqlParams = []
        const conditions = []

        // Iterate through each key-value pair in queryParams
        for (const key in queryParams) {
            if (queryParams.hasOwnProperty(key)) {
                conditions.push(`${key} = ?`)
                sqlParams.push(queryParams[key])
            }
        }

        // Combine conditions with AND in the SQL query
        if (conditions.length > 0) {
            sqlQuery += ' WHERE ' + conditions.join(' AND ')
        }

        pool.query(sqlQuery, sqlParams, (error, result) => {
            if (error) {
                logger.error('Error executing query:', error)
                callback(error, null)
            } else {
                let data = result

                if (data.length === 0) {
                    logger.warn('No user found with the specified criteria.')
                    callback(null, null)
                    return
                }

                if (!includePrivateData) {
                    data.forEach((user) => delete user.password)
                }

                logger.info('User(s) fetched successfully.')
                callback(null, data)
            }
        })
    },

    deleteUserById: (userId, includePrivateData, callback) => {
        logger.info(`Deleting user with ID ${userId} from the database...`)
        pool.query(
            'SELECT id FROM user WHERE id = ?',
            [userId],
            (error, result) => {
                if (error) {
                    logger.error('Error checking user existence:', error)
                    callback('Error checking user existence', null)
                } else {
                    if (result.length > 0) {
                        // User exists, proceed with deletion if authorized
                        if (includePrivateData) {
                            pool.query(
                                'DELETE FROM user WHERE id = ?',
                                [userId],
                                (deleteError, deleteResult) => {
                                    if (deleteError) {
                                        logger.error(
                                            'Error deleting user:',
                                            deleteError
                                        )
                                        callback('Error deleting user', null)
                                    } else {
                                        if (deleteResult.affectedRows > 0) {
                                            logger.info(
                                                `User with ID ${userId} has been deleted.`
                                            )
                                            callback(
                                                null,
                                                `User with ID ${userId} has been deleted`
                                            )
                                        } else {
                                            logger.warn(
                                                'User not found during deletion.'
                                            )
                                            callback('User not found', null)
                                        }
                                    }
                                }
                            )
                        } else {
                            logger.warn('Not authorized to delete user.')
                            callback('Not authorized', null)
                        }
                    } else {
                        // User not found
                        logger.warn(`User with ID ${userId} not found.`)
                        callback('User not found', null)
                    }
                }
            }
        )
    },

    getUserByEmailAdress: (emailAdress, includePrivateData, callback) => {
        logger.info(
            `Fetching user by email address ${emailAdress} from the database...`
        )
        pool.query(
            'SELECT * FROM user WHERE emailAdress = ?',
            [emailAdress],
            (error, result) => {
                if (error) {
                    logger.error('Error executing query:', error)
                    callback(error, null)
                } else {
                    let data = result.length > 0 ? result[0] : null
                    if (data == null) {
                        logger.warn(
                            `No user found with email address ${emailAdress}.`
                        )
                        callback(null, null)
                        return
                    }

                    if (!includePrivateData) {
                        delete data.password
                    }

                    logger.info(
                        `User with email address ${emailAdress} fetched successfully.`
                    )
                    callback(null, data)
                }
            }
        )
    },

    createUser: (userData, callback) => {
        logger.info('Creating a new user...')
        const query = `
            INSERT INTO user (firstName, lastName, emailAdress, password, phoneNumber, street, city)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `

        const values = [
            userData.firstName,
            userData.lastName,
            userData.emailAdress,
            userData.password,
            userData.phoneNumber,
            userData.street,
            userData.city
        ]

        pool.query(query, values, (error, result) => {
            if (error) {
                logger.error('Error creating user:', error)
                callback(error, null)
            } else {
                logger.info('User created successfully.')
                callback(null, result)
            }
        })
    },

    updateUser: (userData, userIdFromToken, callback) => {
        logger.info('Updating user information...')
        const {
            emailAdress,
            password,
            firstName,
            lastName,
            phoneNumber,
            street,
            city
        } = userData

        // Check if the user exists based on the provided email address
        const checkUserQuery = `
            SELECT id FROM user
            WHERE emailAdress = ?;
        `

        pool.query(checkUserQuery, [emailAdress], (error, results) => {
            if (error) {
                logger.error('Error checking user existence:', error)
                return callback(error, undefined)
            }

            // If a user with the provided email address exists
            if (results && results.length > 0) {
                const userIdFromQuery = results[0].id

                const includePrivateData = userIdFromToken == userIdFromQuery

                if (includePrivateData) {
                    logger.info(
                        'User authorization verified, proceeding with update...'
                    )
                    let updateUserQuery = `UPDATE user SET `
                    const updateValues = []

                    // Add fields to update query and updateValues array
                    if (firstName) {
                        updateUserQuery += 'firstName = ?, '
                        updateValues.push(firstName)
                    }
                    if (lastName) {
                        updateUserQuery += 'lastName = ?, '
                        updateValues.push(lastName)
                    }
                    if (password) {
                        updateUserQuery += 'password = ?, '
                        updateValues.push(password)
                    }
                    if (phoneNumber) {
                        updateUserQuery += 'phoneNumber = ?, '
                        updateValues.push(phoneNumber)
                    }
                    if (street) {
                        updateUserQuery += 'street = ?, '
                        updateValues.push(street)
                    }
                    if (city) {
                        updateUserQuery += 'city = ?, '
                        updateValues.push(city)
                    }

                    updateUserQuery = updateUserQuery.slice(0, -2) // Remove the trailing comma and space
                    updateUserQuery += ' WHERE emailAdress = ?;'

                    // Add emailAdress to the updateValues array
                    updateValues.push(emailAdress)

                    // Execute the SQL query to update the user
                    pool.query(
                        updateUserQuery,
                        updateValues,
                        (updateError, updateResult) => {
                            if (updateError) {
                                logger.error(
                                    'Error updating user:',
                                    updateError
                                )
                                return callback(updateError, undefined)
                            }

                            // Fetch the updated user data
                            const fetchUserQuery = `
                                SELECT * FROM user
                                WHERE emailAdress = ?;
                            `

                            pool.query(
                                fetchUserQuery,
                                [emailAdress],
                                (fetchError, fetchResult) => {
                                    if (fetchError) {
                                        logger.error(
                                            'Error fetching updated user:',
                                            fetchError
                                        )
                                        return callback(fetchError, undefined)
                                    }
                                    logger.info('User updated successfully.')
                                    callback(undefined, fetchResult[0])
                                }
                            )
                        }
                    )
                } else {
                    logger.warn('User not authorized for update.')
                    callback('Not authorized', null)
                }
            } else {
                logger.warn('User not found during update.')
                callback('User not found', undefined)
            }
        })
    },

    deleteUserByEmailAdress: (emailAdress, callback) => {
        logger.info(
            `Deleting user with email address ${emailAdress} from the database...`
        )
        pool.query(
            'DELETE FROM user WHERE emailAdress = ?',
            [emailAdress],
            (error, result) => {
                if (error) {
                    logger.error('Error deleting user:', error)
                    return callback(error)
                }
                // Check if any rows were affected (i.e., if a user was deleted)
                const isDeleted = result && result.affectedRows > 0
                logger.info(
                    `User with email address ${emailAdress} has been deleted: ${isDeleted}`
                )
                callback(null, isDeleted)
            }
        )
    }
}

module.exports = userService
