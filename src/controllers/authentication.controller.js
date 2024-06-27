const authService = require('../services/authentication.service')
const logger = require('../util/logger')

const authController = {
    login: (req, res, next) => {
        const userCredentials = req.body
        logger.trace('Received login request:', userCredentials) // Trace logging for request details
        authService.login(userCredentials, (error, success) => {
            if (error) {
                logger.error('Error occurred during login:', error) // Error logging for authentication failure
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                logger.info('Login successful:', success.data.username) // Info logging for successful login
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    }
}

module.exports = authController
