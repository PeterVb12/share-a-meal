const logger = require('../util/logger')

const db = require('../dao/mysql-db')

const mealService = {
    create: (meal, callback) => {
        logger.info('service creating meal:', meal.name);
    
        // Verbinding maken met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Query om de hoogste ID op te halen
            connection.query(
                'SELECT MAX(id) AS maxId FROM `meal`',
                function (error, results, fields) {
                    if (error) {
                        connection.release();
                        logger.error(error);
                        callback(error, null);
                        return;
                    }
    
                    // Berekenen van het nieuwe ID
                    const newId = results[0].maxId + 1;
    
                    // Uitvoeren van een query om een nieuwe gebruiker toe te voegen met het nieuwe ID
                    connection.query(
                        'INSERT INTO `meal` SET ?',
                        {
                            id: newId,
                            isActive: meal.isActive,
                            isVega: meal.isVega,
                            isVegan: meal.isVegan,
                            isToTakeHome: meal.isToTakeHome,
                            dateTime: meal.dateTime,
                            maxAmountOfParticipants: meal.maxAmountOfParticipants,
                            price: meal.price,
                            imageUrl: meal.imageUrl,
                            cookId: meal.cookId,
                            createDate: meal.createDate,
                            updateDate: meal.updateDate,
                            name: meal.name,
                            description: meal.description,
                            allergenes: meal.allergenes
                        },
                        function (error, results, fields) {
                            connection.release();
    
                            if (error) {
                                logger.error(error);
                                callback(error, null);
                            } else {
                                logger.debug(results);
                                callback(null, {
                                    message: `Meal created with id ${newId}.`,
                                    data: { ...meal, id: newId }
                                });
                            }
                        }
                    );
                }
            );
        });
    },

    getAll: (callback) => {
        logger.info('service getAll meals')
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `meal`',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} meals.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getById: (mealId, callback) => {
        logger.info(`servide meal getById with id ${mealId}`);
    
        // Verbinding maken met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Uitvoeren van een query om een specifieke gebruiker op te halen
            connection.query(
                'SELECT * FROM `meal` WHERE id = ?',
                [mealId],
                function (error, results, fields) {
                    connection.release();
    
                    if (error) {
                        logger.error(error);
                        callback(error, null);
                    } else {
                        if (results.length === 0) {
                            const notFoundError = new Error(`meal with id ${mealId} not found`);
                            logger.error(notFoundError);
                            callback(notFoundError, null);
                        } else {
                            logger.debug(results);
                            callback(null, {
                                message: `Meal with id ${mealId} found.`,
                                data: results[0]
                            });
                        }
                    }
                }
            );
        });
    },

    delete: (mealId, callback) => {
        logger.info(`Deleting meal with id ${mealId}`);
    
        // Verbinding maken met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Uitvoeren van een query om de gebruiker te verwijderen
            connection.query(
                'DELETE FROM `meal` WHERE id = ?',
                [mealId],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        logger.error(error);
                        callback(error, null);
                    } else {
                        logger.debug(results);
                        if (results.affectedRows === 0) {
                            const notFoundError = new Error(`meal with id ${mealId} not found`);
                            logger.error(notFoundError);
                            callback(notFoundError, null);
                        } else {
                            callback(null, {
                                message: `Meal with id ${mealId} deleted successfully.`,
                                data: results
                            });
                        }
                    }
                }
            );
        });
    },
}

module.exports = mealService