const jwt = require('../util/jwt')
const { pool } = require('../dao/mysql-db')
const jwtSecretKey = require('../util/config').secretkey
const logger = require('../util/logger')

const authController = {
    login: async (userCredentials, callback) => {
        pool.query(
            'SELECT `id`, `emailAdress`, `password`, `firstName`, `lastName` FROM `user` WHERE `emailAdress` = ?',
            [userCredentials.emailAdress],
            async (err, rows, fields) => {
                if (err) {
                    logger.error('Database error:', err) // Log database error
                    return callback(
                        {
                            status: 500,
                            message: 'Database error',
                            data: {}
                        },
                        null
                    )
                }

                if (rows && rows.length === 1) {
                    // Check the password
                    if (rows[0].password === userCredentials.password) {
                        const { password, ...userinfo } = rows[0]
                        const payload = {
                            userId: userinfo.id
                        }

                        try {
                            let token = await jwt.sign(payload)
                            callback(null, {
                                status: 200,
                                message: 'User successfully logged in',
                                data: { ...userinfo, token }
                            })
                        } catch (err) {
                            logger.error('Token creation error:', err) // Log token creation error
                            callback(
                                {
                                    status: 500,
                                    message: 'Could not create token',
                                    data: {}
                                },
                                null
                            )
                        }
                    } else {
                        logger.error('Password is incorrect') // Log incorrect password
                        callback(
                            {
                                status: 400,
                                message: 'Password is incorrect',
                                data: {}
                            },
                            null
                        )
                    }
                } else {
                    logger.error('User does not exist') // Log user does not exist
                    callback(
                        {
                            status: 404,
                            message: 'User does not exist',
                            data: {}
                        },
                        null
                    )
                }
            }
        )
    }
}

module.exports = authController
