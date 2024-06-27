const { pool } = require('../dao/mysql-db')
const logger = require('../util/logger')

let mealService = {
    createMeal: (cookId, mealData, callback) => {
        logger.info('Creating a new meal...')
        const query = `
            INSERT INTO meal (isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, name, description, allergenes, cookId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

        const values = [
            mealData.isActive,
            mealData.isVega,
            mealData.isVegan,
            mealData.isToTakeHome,
            mealData.dateTime,
            mealData.maxAmountOfParticipants,
            mealData.price,
            mealData.imageUrl,
            mealData.name,
            mealData.description,
            mealData.allergenes,
            cookId
        ]

        pool.query(query, values, (error, result) => {
            if (error) {
                logger.error('Error creating meal:', error)
                callback(error, null)
            } else {
                logger.info('Meal created successfully.' + result)
                callback(null, result)
            }
        })
    },

    update: (mealId, updatedMeal, callback) => {
        logger.info(`Updating meal with id ${mealId}`)

        pool.query(
            'UPDATE `meal` SET ? WHERE id = ?',
            [updatedMeal, mealId],
            (error, results, fields) => {
                if (error) {
                    logger.error(error)
                    callback(error, null)
                } else {
                    logger.debug(results)
                    if (results.affectedRows === 0) {
                        const notFoundError = new Error(`Meal with id ${mealId} not found`)
                        logger.error(notFoundError)
                        callback(notFoundError, null)
                    } else {
                        callback(null, {
                            message: `Meal with id ${mealId} updated successfully.`,
                            data: { ...updatedMeal, id: mealId }
                        })
                    }
                }
            }
        )
    },

    getMeals: (callback) => {
        logger.info('Fetching meals from the database...')
        pool.query(
            'SELECT id, isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes FROM meal',
            (error, result) => {
                if (error) {
                    logger.error('Error fetching meals:', error)
                    callback(error, null)
                } else {
                    logger.info('Meals fetched successfully.')
                    callback(null, result)
                }
            }
        )
    },

    getMealById: (mealIdFromParams, includePrivateData, callback) => {
        // Log the start of the fetch operation
        logger.info(
            `Fetching meal with ID ${mealIdFromParams} from the database...`
        )

        // Execute the database query to fetch the meal
        pool.query(
            'SELECT * FROM meal WHERE id = ?',
            [mealIdFromParams],
            (error, result) => {
                // Handle any errors that occurred during the query execution
                if (error) {
                    logger.error('Error executing query:', error)
                    callback(error, null) // Callback with the error and null data
                } else {
                    // Extract the meal data from the query result
                    let data = result.length > 0 ? result[0] : null
                    logger.trace(data)

                    // Check if the meal was found
                    if (data == null) {
                        logger.warn(
                            `Meal with ID ${mealIdFromParams} not found.`
                        )
                        callback(null, null) // Callback with null data
                        return
                    }
                    // Log the successful fetch operation
                    logger.info(
                        `Meal with ID ${mealIdFromParams} fetched successfully.`
                    )
                    callback(null, data)
                }
            }
        )
    },

    deleteMealById: (mealId, callback) => {
        logger.info(`Deleting meal with ID ${mealId} from the database...`)
        pool.query(
            'SELECT id FROM meal WHERE id = ?',
            [mealId],
            (error, result) => {
                if (error) {
                    logger.error('Error checking meal existence:', error)
                    callback('Error checking meal existence', null)
                } else {
                    if (result.length > 0) {
                        // Meal exists, proceed with deletion
                        pool.query(
                            'DELETE FROM meal WHERE id = ?',
                            [mealId],
                            (deleteError, deleteResult) => {
                                if (deleteError) {
                                    logger.error(
                                        'Error deleting meal:',
                                        deleteError
                                    )
                                    callback('Error deleting meal', null)
                                } else {
                                    if (deleteResult.affectedRows > 0) {
                                        logger.info(
                                            `Meal with ID ${mealId} has been deleted.`
                                        )
                                        callback(
                                            null,
                                            `Meal with ID ${mealId} has been deleted`
                                        )
                                    } else {
                                        logger.warn(
                                            'Meal not found during deletion.'
                                        )
                                        callback('Meal not found', null)
                                    }
                                }
                            }
                        )
                    } else {
                        // Meal not found
                        logger.warn(`Meal with ID ${mealId} not found.`)
                        callback('Meal not found', null)
                    }
                }
            }
        )
    },

    getCookIdByMealId: async (mealIdFromParams) => {
        return new Promise((resolve, reject) => {
            logger.info(
                `Fetching cook ID for meal with ID ${mealIdFromParams} from the database...`
            )
            pool.query(
                'SELECT cookId FROM meal WHERE id = ?',
                [mealIdFromParams],
                (error, result) => {
                    if (error) {
                        logger.error('Error fetching cook ID:', error)
                        reject('Error fetching cook ID')
                    } else {
                        if (result.length > 0) {
                            const cookId = result[0].cookId
                            logger.info(
                                `Cook ID ${cookId} found for meal with ID ${mealIdFromParams}.`
                            )
                            resolve(cookId)
                        } else {
                            logger.warn(
                                `Meal with ID ${mealIdFromParams} not found.`
                            )
                            reject('Meal not found')
                        }
                    }
                }
            )
        })
    }
}

module.exports = mealService
