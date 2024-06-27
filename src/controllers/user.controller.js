const chai = require('chai')
const userService = require('../services/user.service')
const chaiHttp = require('chai-http')
chai.should()
chai.use(chaiHttp)
const logger = require('../util/logger')

let userController = {
    getAll: (req, res, next) => {
        userService.getUsers((error, data) => {
            if (error) {
                logger.error('Error fetching all users:', error)
                res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error'
                })
            } else {
                logger.info('Fetched all users successfully')
                res.status(200).json({
                    status: 200,
                    message: `Found ${data.length} users`,
                    data
                })
            }
        })
    },

    getUserByField: (req, res, next) => {
        const queryParams = req.query

        const userIdFromToken = req.userId
        const userIdFromParams = req.params.userId

        const userId = userIdFromParams ?? userIdFromToken
        const includePrivateData = userIdFromToken == userId

        userService.getUserByField(
            queryParams,
            includePrivateData,
            (error, users) => {
                if (error) {
                    logger.error('Error fetching user by field:', error)
                    res.status(500).json({
                        status: 500,
                        message: 'Internal Server Error'
                    })
                } else if (!users) {
                    logger.info('User not found by field')
                    res.status(404).json({
                        status: 404,
                        message: 'User not found',
                        data: {}
                    })
                } else {
                    logger.info('User(s) found by field:', users)
                    res.status(200).json({
                        status: 200,
                        message:
                            users.length > 1 ? 'Users found' : 'User found',
                        data: users
                    })
                }
            }
        )
    },

    getUserById: (req, res, next) => {
        const userIdFromToken = req.userId
        const userIdFromParams = req.params.userId

        const userId = userIdFromParams ?? userIdFromToken
        const includePrivateData = userIdFromToken == userId

        userService.getUserById(userId, includePrivateData, (error, user) => {
            if (error) {
                logger.error('Error fetching user by ID:', error) // Log error fetching user by ID
                res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error'
                })
            } else if (!user) {
                logger.info('User not found by ID:', userId) // Log user not found by ID
                res.status(404).json({
                    status: 404,
                    message: 'User not found',
                    data: {}
                })
            } else {
                logger.trace('User found by ID:', user) // Log user found by ID
                res.status(200).json({
                    status: 200,
                    message: 'User found',
                    data: user
                })
            }
        })
    },

    createUser: (req, res, next) => {
        const {
            firstName,
            lastName,
            emailAdress,
            password,
            phoneNumber,
            street,
            city
        } = req.body

        const userData = {
            firstName,
            lastName,
            emailAdress,
            password,
            phoneNumber,
            street,
            city
        }

        userService.createUser(userData, (error, result) => {
            if (error) {
                logger.error('Error creating user:', error) // Log error during user creation
                let errorMessage = error.message
                if (errorMessage.includes('Duplicate')) {
                    errorMessage =
                        'Email address has already been used to create an account'
                }

                res.status(403).json({
                    status: 403,
                    message: errorMessage,
                    data: {}
                })
            } else {
                userService.getUserByEmailAdress(
                    emailAdress,
                    true,
                    (error, user) => {
                        if (error) {
                            logger.error(
                                'Error fetching user after creation:',
                                error
                            ) // Log error fetching user after creation
                            res.status(500).json({
                                status: 500,
                                message: 'Internal Server Error'
                            })
                        } else if (!user) {
                            logger.error('User not found after creation') // Log user not found after creation
                            res.status(404).json({
                                status: 404,
                                message: 'User not found',
                                data: {}
                            })
                        } else {
                            logger.info('User created successfully:', user) // Log successful user creation
                            res.status(200).json({
                                status: 200,
                                message: 'User created successfully',
                                data: user
                            })
                        }
                    }
                )
            }
        })
    },

    deleteUserbyId: (req, res) => {
        const userIdFromToken = req.userId
        const userIdToDelete = req.params.userId

        const userId = userIdToDelete ?? userIdFromToken
        const includePrivateData = userIdFromToken == userId

        // Call the service function to delete the user
        userService.deleteUserById(
            userId,
            includePrivateData,
            (error, message) => {
                if (error) {
                    let statusCode = 500 // Internal Server Error by default

                    if (error === 'Not authorized') {
                        statusCode = 403 // Forbidden
                        logger.error('User deletion not authorized:', userId) // Log unauthorized user deletion
                    } else if (error === 'User not found') {
                        statusCode = 404 // Not Found
                        logger.error('User not found for deletion:', userId) // Log user not found for deletion
                    } else if (
                        error === 'Error checking user existence' ||
                        error === 'Error deleting user'
                    ) {
                        statusCode = 400 // Bad Request
                        logger.error('Error checking user existence:', error) // Log error checking user existence
                    }
                    res.status(statusCode).json({
                        status: statusCode,
                        message: error
                    })
                } else {
                    logger.info('User deleted successfully:', userId) // Log successful user deletion
                    // Send JSON response with success message
                    res.status(200).json({ status: 200, message: message })
                }
            }
        )
    },

    updateUser: (req, res, next) => {
        const {
            firstName,
            lastName,
            emailAdress,
            password,
            phoneNumber,
            street,
            city
        } = req.body

        const userData = {
            firstName,
            lastName,
            emailAdress,
            password,
            phoneNumber,
            street,
            city
        }

        const userIdFromToken = req.userId
        userService.updateUser(userData, userIdFromToken, (error, result) => {
            if (error) {
                if (error === 'Not authorized') {
                    logger.error('User update not authorized:', userIdFromToken) // Log unauthorized user update
                    return res.status(403).json({
                        status: 403,
                        message: 'Not authorized',
                        data: {}
                    })
                } else if (error === 'User not found') {
                    logger.error('User not found for update:', userIdFromToken) // Log user not found for update
                    return res.status(404).json({
                        status: 404,
                        message: 'User not found',
                        data: {}
                    })
                } else {
                    logger.error('Error updating user data:', error.message) // Log error updating user data
                    return res.status(500).json({
                        status: 500,
                        message: error.message,
                        data: {}
                    })
                }
            }

            if (result) {
                logger.info('User data updated successfully:', result) // Log successful user data update
                return res.status(200).json({
                    status: 200,
                    message: 'User data updated successfully',
                    data: result
                })
            }

            logger.error('User not found after update:', userIdFromToken) // Log user not found after update
            return res.status(404).json({
                status: 404,
                message: 'User not found',
                data: {}
            })
        })
    }
}

module.exports = userController
