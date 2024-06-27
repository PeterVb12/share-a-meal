const chai = require('chai')
chai.should()
const assert = require('assert')
const jwt = require('../util/jwt')
const jwtSecretKey = require('../util/config').secretkey
const logger = require('../util/logger')

const authenticationMiddleware = {
    validateToken: async (req, res, next) => {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            logger.error('Not logged in') // Log error
            return next({
                status: 401,
                message: 'Not logged in',
                data: {}
            })
        }

        if (!authHeader.startsWith('Bearer ')) {
            logger.error('Not valid token') // Log error
            return next({
                status: 401,
                message: 'Not valid token',
                data: {}
            })
        }

        // Strip the word 'Bearer ' from the header value
        const token = authHeader.substring(7, authHeader.length)

        try {
            const payload = await jwt.verify(token, jwtSecretKey)
            /**
             * User heeft toegang.
             * BELANGRIJK! Voeg UserId uit payload toe aan request,
             * zodat die voor ieder volgend endpoint beschikbaar is.
             * Je hebt dan altijd toegang tot de userId van de ingelogde gebruiker.
             */
            req.userId = payload.userId
            next()
        } catch (err) {
            logger.error('Not valid token', err) // Log error with details
            next({
                status: 401,
                message: 'Not valid token',
                error: err,
                data: {}
            })
        }
    }

    
}

module.exports = authenticationMiddleware
