const chai = require('chai')
const mealService = require('../services/meal.service')
const chaiHttp = require('chai-http')
chai.should()
chai.use(chaiHttp)
const logger = require('../util/logger')

let mealController = {
    createMeal: (req, res, next) => {
        const cookId = req.userId

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

        const mealData = {
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
        }

        mealService.createMeal(cookId, mealData, (error, result) => {
            if (error) {
                logger.error('Error creating meal:', error)
                let errorMessage = error.message
                if (errorMessage.includes('Duplicate')) {
                    errorMessage = 'Meal with similar details already exists'
                }

                res.status(403).json({
                    status: 403,
                    message: errorMessage,
                    data: {}
                })
            } else {
                mealService.getMealById(
                    result.insertId,
                    false,
                    (error, meal) => {
                        if (error) {
                            logger.error(
                                'Error fetching meal after creation:',
                                error
                            ) // Log error fetching meal after creation
                            res.status(500).json({
                                status: 500,
                                message: 'Internal Server Error'
                            })
                        } else if (!meal) {
                            logger.error('Meal not found after creation') // Log meal not found after creation
                            res.status(404).json({
                                status: 404,
                                message: 'Meal not found',
                                data: {}
                            })
                        } else {
                            logger.info('Meal created successfully:', meal) // Log successful meal creation
                            res.status(200).json({
                                status: 200,
                                message: 'Meal created successfully',
                                data: meal
                            })
                        }
                    }
                )
            }
        })
    },

    update: (req, res) => {
        const mealId = req.params.mealid;
        const updatedMeal = req.body;

        mealService.update(mealId, updatedMeal, (err, result) => {
            if (err) {
                res.status(500).json({
                    status: 500,
                    message: err.message,
                    data: {}
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: result.message,
                    data: result.data
                });
            }
        });
    },


    getAll: (req, res, next) => {
        mealService.getMeals((error, data) => {
            if (error) {
                logger.error('Error fetching all meals:', error)
                res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error'
                })
            } else {
                logger.info('Fetched all meals successfully')
                res.status(200).json({
                    status: 200,
                    message: `Found ${data.length} meals`,
                    data
                })
            }
        })
    },

    getMealById: (req, res, next) => {
        const mealIdFromParams = req.params.mealId
        const includePrivateData = false // Assuming you always want public data for meals

        mealService.getMealById(
            mealIdFromParams,
            includePrivateData,
            (error, meal) => {
                if (error) {
                    logger.error('Error fetching meal by ID:', error)
                    res.status(500).json({
                        status: 500,
                        message: 'Internal Server Error'
                    })
                } else if (!meal) {
                    logger.info('Meal not found by ID:', mealIdFromParams)
                    res.status(404).json({
                        status: 404,
                        message: 'Meal not found',
                        data: {}
                    })
                } else {
                    logger.trace('Meal found by ID:', meal)
                    res.status(200).json({
                        status: 200,
                        message: 'Meal found',
                        data: meal
                    })
                }
            }
        )
    },

    deleteMealById: async (req, res, next) => {
        const mealIdFromParams = req.params.mealId
        const userIdFromToken = req.userId // Assuming userId is extracted from the token
        logger.trace('mealIdFromParams = ' + mealIdFromParams)
        logger.trace('userIdFromToken = ' + userIdFromToken)

        let cookId = await mealService.getCookIdByMealId(mealIdFromParams)
        if (userIdFromToken == cookId) {
            mealService.deleteMealById(mealIdFromParams, (error, message) => {
                if (error) {
                    res.status(500).json({
                        status: 500,
                        message: 'Error deleting meal',
                        data: null
                    })
                } else {
                    res.status(200).json({
                        status: 200,
                        message: 'Meal deleted successfully',
                        data: { mealId: mealIdFromParams }
                    })
                }
            })
        } else {
            res.status(403).json({
                status: 403,
                message: 'User not authorized to delete this meal',
                data: null
            })
        }
    }
}

module.exports = mealController
