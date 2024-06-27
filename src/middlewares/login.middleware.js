const chai = require('chai')
chai.should()
const assert = require('assert')
const logger = require('../util/logger')

const loginMiddleware = {
    validateLogin: (req, res, next) => {
        const { emailAdress, password } = req.body

        if (!emailAdress || !password) {
            logger.error('Missing required fields.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Missing required fields.',
                data: {}
            })
        }

        if (typeof emailAdress !== 'string' || typeof password !== 'string') {
            logger.error('Email address and password must be strings.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Email address and password must be strings.',
                data: {}
            })
        }

        if (!validateEmail(emailAdress)) {
            logger.error('Invalid emailadress format') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Invalid emailadress format',
                data: {}
            })
        }

        if (!validatePassword(password)) {
            logger.error('Invalid password format.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Invalid password format.',
                data: {}
            })
        }

        next()
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
}

module.exports = loginMiddleware
