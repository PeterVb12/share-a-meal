const logger = require('../util/logger')

let userMiddleware = {
    validateUserCreateMiddleware: (req, res, next) => {
        const {
            firstName,
            lastName,
            emailAdress,
            password,
            phoneNumber,
            street,
            city
        } = req.body

        const missingFields = []

        if (!firstName) {
            missingFields.push('firstName')
        }

        if (!lastName) {
            missingFields.push('lastName')
        }

        if (!emailAdress) {
            missingFields.push('emailAdress')
        } else {
            // Email address validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(emailAdress)) {
                logger.error('Invalid emailadress format') // Log error
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid emailadress format',
                    data: {}
                })
            }
        }

        if (!password) {
            missingFields.push('password')
        } else {
            // Password validation
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
            if (!passwordRegex.test(password)) {
                logger.error('Invalid password format.') // Log error
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid password format',
                    data: {}
                })
            }
        }

        if (!phoneNumber) {
            missingFields.push('phoneNumber')
        } else {
            // Phone number validation
            const phoneRegex = /^06[- ]?\d{8}$/
            if (!phoneRegex.test(phoneNumber)) {
                logger.error('Invalid phone number format.') // Log error
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid phone number format',
                    data: {}
                })
            }
        }

        if (!street) {
            missingFields.push('street')
        }

        if (!city) {
            missingFields.push('city')
        }

        if (missingFields.length > 0) {
            logger.error('Missing required fields.', missingFields) // Log error with missing fields
            return res.status(400).json({
                message: 'Missing required fields.',
                missingFields: missingFields, // Ensure missingFields is passed as an array
                data: {}
            })
        }

        next()
    },

    validateUserUpdateMiddleware: (req, res, next) => {
        const {
            firstName,
            lastName,
            emailAdress,
            password,
            phoneNumber,
            street,
            city
        } = req.body

        if (!emailAdress) {
            logger.error('Email address is required.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Email address is required',
                data: {}
            })
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(emailAdress)) {
                logger.error('Invalid emailadress format') // Log error
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid emailadress format',
                    data: {}
                })
            }
        }

        if (
            firstName !== undefined &&
            (typeof firstName !== 'string' || firstName.trim() === '')
        ) {
            logger.error('First name must be a non-empty string if provided.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'First name must be a non-empty string if provided',
                data: {}
            })
        }

        if (
            lastName !== undefined &&
            (typeof lastName !== 'string' || lastName.trim() === '')
        ) {
            logger.error('Last name must be a non-empty string if provided.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Last name must be a non-empty string if provided',
                data: {}
            })
        }

        if (
            street !== undefined &&
            (typeof street !== 'string' || street.trim() === '')
        ) {
            logger.error('Street must be a non-empty string if provided.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Street must be a non-empty string if provided',
                data: {}
            })
        }

        if (
            city !== undefined &&
            (typeof city !== 'string' || city.trim() === '')
        ) {
            logger.error('City must be a non-empty string if provided.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'City must be a non-empty string if provided',
                data: {}
            })
        }

        if (password) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
            if (!passwordRegex.test(password)) {
                logger.error('Invalid password format.') // Log error
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid password format',
                    data: {}
                })
            }
        }

        if (phoneNumber) {
            const phoneRegex = /^06[- ]?\d{8}$/
            if (!phoneRegex.test(phoneNumber)) {
                logger.error('Invalid phone number format.') // Log error
                return res.status(400).json({
                    message: 'Invalid phone number format',
                    data: {}
                })
            }
        }
        next()
    },

    validateParamsMiddleware: (req, res, next) => {
        const validParams = [
            'id',
            'firstName',
            'lastName',
            'isActive',
            'emailAdress',
            'phoneNumber',
            'roles',
            'street',
            'city'
        ]

        const invalidParams = Object.keys(req.query).filter(
            (param) => !validParams.includes(param)
        )

        if (invalidParams.length > 0) {
            logger.error('Invalid query parameters.', invalidParams) // Log error with invalid parameters
            return res.status(400).json({
                status: 400,
                message: 'Invalid query parameters',
                invalidParams: invalidParams
            })
        }

        next() // Proceed to the next middleware or route handler
    }
}

module.exports = userMiddleware
