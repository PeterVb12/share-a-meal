const database = require('../dao/inmem-db')
const logger = require('../util/logger')

const db = require('../dao/mysql-db')

const userService = {
    //inmem

    // create: (user, callback) => {
    //     logger.info('create user', user)
    //     database.add(user, (err, data) => {
    //         if (err) {
    //             logger.info(
    //                 'error creating user: ',
    //                 err.message || 'unknown error'
    //             )
    //             callback(err, null)
    //         } else {
    //             logger.trace(`User created with id ${data.id}.`)
    //             callback(null, {
    //                 message: `User created with id ${data.id}.`,
    //                 data: data
    //             })
    //         }
    //     })
    // },

    create: (user, callback) => {
        logger.info('Creating user:', user);
    
        // Verbinding maken met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Query om de hoogste ID op te halen
            connection.query(
                'SELECT MAX(id) AS maxId FROM `user`',
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
                        'INSERT INTO `user` SET ?',
                        {
                            id: newId,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            emailAdress: user.emailAddress,
                            password: user.password,
                            isActive: user.isActive,
                            street: user.street,
                            city: user.city,
                            phoneNumber: user.phoneNumber,
                            roles: JSON.stringify(user.roles) // Converteer de roles-array naar een JSON-string
                        },
                        function (error, results, fields) {
                            connection.release();
    
                            if (error) {
                                logger.error(error);
                                callback(error, null);
                            } else {
                                logger.debug(results);
                                callback(null, {
                                    message: `User created with id ${newId}.`,
                                    data: { ...user, id: newId }
                                });
                            }
                        }
                    );
                }
            );
        });
    },

    //inmem

    // updateUser: (userId, user, callback) => {
    //     database.updateUser(userId, user, (err, data) => {
    //         if (err) {
    //             callback(err, null)
    //         } else {
    //             callback(null, {
    //                 message: `User updated with id ${data.id}.`,
    //                 data: data
    //             })
    //         }
    //     })
    // },

    //mysql
    updateUser: (userId, updatedUser, callback) => {
        logger.info(`Updating user with id ${userId}`);
    
        // Verbinding maken met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Controleren en bijwerken van de roles kolom
            if (updatedUser.roles) {
                updatedUser.roles = JSON.stringify(updatedUser.roles);
            }
    
            // Uitvoeren van een query om de gebruiker bij te werken
            connection.query(
                'UPDATE `user` SET ? WHERE `id` = ?',
                [updatedUser, userId],
                function (error, results, fields) {
                    connection.release();
    
                    if (error) {
                        logger.error(error);
                        callback(error, null);
                    } else {
                        logger.debug(results);
                        if (results.affectedRows > 0) {
                            callback(null, {
                                message: `User updated with id ${userId}.`,
                                data: updatedUser
                            });
                        } else {
                            const error = { message: `User with id ${userId} not found.` };
                            logger.error(error);
                            callback(error, null);
                        }
                    }
                }
            );
        });
    },

    getAll: (callback) => {
        logger.info('getAll')

        // Deprecated: de 'oude' manier van werken, met de inmemory database
        // database.getAll((err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         callback(null, {
        //             message: `Found ${data.length} users.`,
        //             data: data
        //         })
        //     }
        // })

        // Nieuwe manier van werken: met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT id, firstName, lastName FROM `user`',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} users.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    //inmem

    // getById: (userId, callback) => {
    //     database.getById(userId, (err, data) => {
    //         if (err) {
    //             callback(err, null)
    //         } else {
    //             callback(null, {
    //                 message: `User updated with id ${data.id}.`,
    //                 data: data
    //             })
    //         }
    //     })
    // },

    //mysql
    getById: (userId, callback) => {
        logger.info(`getById for user with id ${userId}`);
    
        // Verbinding maken met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Uitvoeren van een query om een specifieke gebruiker op te halen
            connection.query(
                'SELECT * FROM `user` WHERE id = ?',
                [userId],
                function (error, results, fields) {
                    connection.release();
    
                    if (error) {
                        logger.error(error);
                        callback(error, null);
                    } else {
                        if (results.length === 0) {
                            const notFoundError = new Error(`User with id ${userId} not found`);
                            logger.error(notFoundError);
                            callback(notFoundError, null);
                        } else {
                            logger.debug(results);
                            callback(null, {
                                message: `User with id ${userId} found.`,
                                data: results[0]
                            });
                        }
                    }
                }
            );
        });
    },

    //mysql
    getProfile: (userId, callback) => {
        logger.info('getProfile userId:', userId)

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT id, firstName, lastName FROM `user` WHERE id = ?',
                [userId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} user.`,
                            data: results
                        })
                    }
                }
            )
        })
    },


    // //inmem

    // delete: (userId, callback) => {
    //     database.delete(userId, (err, data) => {
    //         if (err) {
    //             callback(err, null)
    //         } else {
    //             callback(null, {
    //                 message: `User updated with id ${data.id}.`,
    //                 data: data
    //             })
    //         }
    //     })
    // },
    
    //mysql
    delete: (userId, callback) => {
        logger.info(`Deleting user with id ${userId}`);
    
        // Verbinding maken met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }
    
            // Uitvoeren van een query om de gebruiker te verwijderen
            connection.query(
                'DELETE FROM `user` WHERE id = ?',
                [userId],
                function (error, results, fields) {
                    connection.release();
    
                    if (error) {
                        logger.error(error);
                        callback(error, null);
                    } else {
                        logger.debug(results);
                        if (results.affectedRows === 0) {
                            const notFoundError = new Error(`User with id ${userId} not found`);
                            logger.error(notFoundError);
                            callback(notFoundError, null);
                        } else {
                            callback(null, {
                                message: `User with id ${userId} deleted successfully.`,
                                data: results
                            });
                        }
                    }
                }
            );
        });
    },
    

    getAllActive: (callback) => {
        database.getAllActive((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                console.log(data)
                callback(null, {
                    message: `Found ${data.length} users.`,
                    data: data
                })
            }
        })
    },
    
    getAllInactive: (callback) => {
        database.getAllInactive((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                console.log(data)
                callback(null, {
                    message: `Found ${data.length} users.`,
                    data: data
                })
            }
        })
    },
}

module.exports = userService