const userService = require('../services/user.service')
const assert = require('assert');

let userController = {
    create: (req, res, next) => {
        const user = req.body
        //
        // Todo: Validate user input
        //

        userService.create(user, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAll: (req, res, next) => {
        userService.getAll((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAllActive: (req, res, next) => {
        userService.getAllActive((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAllInactive: (req, res, next) => {
        userService.getAllInactive((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getById: (req, res, next) => {
        const userId = req.params.userId
        userService.getById(userId, (error, success) => { //If an error occurs during these operations, it constructs an error response object and passes it to the next middleware function, which is typically used to handle errors in Express.js.
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    delete: (req, res, next) => {
        const userId = req.params.userId
        userService.delete(userId, (error, success) => { 
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    
    updateUser: (req, res, next) => {
        console.log('updateUser controller')
        const user = req.body
        const userId = req.params.userId
        userService.updateUser(userId, user, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    // Todo: Implement the update and delete methods
}

module.exports = userController
