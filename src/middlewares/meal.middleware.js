const logger = require('../util/logger')

let mealMiddleware = {
    validateMealCreateMiddleware: (req, res, next) => {
        const {
            isActive,
            isVega,
            isVegan,
            isToTakeHome,
            dateTime,
            maxAmountOfParticipants,
            price,
            imageUrl,
            name,
            description,
            allergenes
        } = req.body

        const missingFields = []

        if (isActive === undefined) {
            missingFields.push('isActive')
        }

        if (isVega === undefined) {
            missingFields.push('isVega')
        }

        if (isVegan === undefined) {
            missingFields.push('isVegan')
        }

        if (isToTakeHome === undefined) {
            missingFields.push('isToTakeHome')
        }

        if (!dateTime) {
            missingFields.push('dateTime')
        }

        if (!maxAmountOfParticipants) {
            missingFields.push('maxAmountOfParticipants')
        }

        if (!price) {
            missingFields.push('price')
        }

        if (!imageUrl) {
            missingFields.push('imageUrl')
        }

        if (!name) {
            missingFields.push('name')
        }

        if (!description) {
            missingFields.push('description')
        }

        if (!allergenes) {
            missingFields.push('allergenes')
        }

        if (missingFields.length > 0) {
            logger.error('Missing required fields.', missingFields) // Log error with missing fields
            return res.status(400).json({
                message: 'Missing required fields.',
                missingFields: missingFields, // Ensure missingFields is passed as an array
                data: {}
            })
        }

        if (isNaN(price) || parseFloat(price) <= 0) {
            logger.error('Invalid price format.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Invalid price format',
                data: {}
            })
        }

        // DateTime validation
        if (isNaN(Date.parse(dateTime))) {
            logger.error('Invalid dateTime format.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Invalid dateTime format',
                data: {}
            })
        }

        // Max Amount of Participants validation
        if (
            isNaN(maxAmountOfParticipants) ||
            parseInt(maxAmountOfParticipants) <= 0
        ) {
            logger.error('Invalid maxAmountOfParticipants format.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'Invalid maxAmountOfParticipants format',
                data: {}
            })
        }

        next()
    },

    validateMealUpdateMiddleware: (req, res, next) => {
        const {
            isActive,
            isVega,
            isVegan,
            isToTakeHome,
            dateTime,
            maxAmountOfParticipants,
            price,
            imageUrl,
            name,
            description,
            allergenes
        } = req.body

        // Ensure at least one field is provided for update
        if (
            isActive === undefined &&
            isVega === undefined &&
            isVegan === undefined &&
            isToTakeHome === undefined &&
            dateTime === undefined &&
            maxAmountOfParticipants === undefined &&
            price === undefined &&
            imageUrl === undefined &&
            name === undefined &&
            description === undefined &&
            allergenes === undefined
        ) {
            logger.error('No fields provided for update.') // Log error
            return res.status(400).json({
                status: 400,
                message: 'No fields provided for update',
                data: {}
            })
        }

        // Additional validation for fields that are provided

        if (price !== undefined) {
            if (isNaN(price) || parseFloat(price) <= 0) {
                logger.error('Invalid price format.') // Log error
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid price format',
                    data: {}
                })
            }
        }

        if (dateTime !== undefined) {
            if (isNaN(Date.parse(dateTime))) {
                logger.error('Invalid dateTime format.') // Log error
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid dateTime format',
                    data: {}
                })
            }
        }

        if (maxAmountOfParticipants !== undefined) {
            if (
                isNaN(maxAmountOfParticipants) ||
                parseInt(maxAmountOfParticipants) <= 0
            ) {
                logger.error('Invalid maxAmountOfParticipants format.') // Log error
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid maxAmountOfParticipants format',
                    data: {}
                })
            }
        }

        next()
    },

    validateParamsMiddleware: (req, res, next) => {
        const validParams = [
            'id',
            'isActive',
            'isVega',
            'isVegan',
            'isToTakeHome',
            'dateTime',
            'maxAmountOfParticipants',
            'price',
            'imageUrl',
            'name',
            'description',
            'allergenes'
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

module.exports = mealMiddleware
