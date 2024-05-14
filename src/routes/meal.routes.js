const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()  
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const validateToken = require('./authentication.routes').validateToken
const logger = require('../util/logger')


// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

//routes
//usecase 301
router.post('/api/meal', mealController.create)
//usecase 303
router.get('/api/meal', mealController.getAll)
//usecase 304
router.get('/api/meal/:mealId', mealController.getById)
//usecase 305
router.delete('/api/meal/:mealId',validateToken, mealController.delete)

module.exports = router