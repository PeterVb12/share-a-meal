const express = require('express')
const chai = require('chai')
chai.should()
const mealRoutes = express.Router()
const mealController = require('../controllers/meal.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const mealMiddleware = require('../middlewares/meal.middleware')

//router.post('/api/user', validateUserCreateChaiExpect, userController.create)

mealRoutes.post(
    '/meal',
    mealMiddleware.validateMealCreateMiddleware,
    authMiddleware.validateToken,
    mealController.createMeal
)

mealRoutes.put('/meal/:mealid',
    mealMiddleware.validateMealUpdateMiddleware,
    authMiddleware.validateToken, 
    mealController.update
)

mealRoutes.get('/meal', 
    authMiddleware.validateToken, 
    mealController.getAll
)

mealRoutes.get(
    '/meal/:mealId',
    authMiddleware.validateToken,
    mealController.getMealById
)

mealRoutes.delete(
    '/meal/:mealId',
    authMiddleware.validateToken,
    mealController.deleteMealById
)

module.exports = mealRoutes
