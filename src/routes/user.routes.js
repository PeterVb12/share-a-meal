const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const assert = require('assert')


// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

function validateUserCreateAssert(req, res, next) {
    const user = req.body;

    try {
        // Controleren of alle vereiste velden aanwezig zijn in de gebruikersinvoer
        assert(user.firstName, 'Name is required');
        assert(user.lastName, 'Last name is required');
        assert(user.emailAddress, 'E-mail is required');
        
        
        // Controleren of het e-mailadres een geldig formaat heeft
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        assert(emailRegex.test(user.emailAddress), 'Invalid email address');

        // Als alle vereisten zijn voldaan, ga door naar de volgende middleware (userController.create)
        next();
    } catch (error) {
        // Als een assertie faalt, wordt een foutmelding gegenereerd en doorgegeven aan de foutafhandeling
        return next({
            status: 400, // Bad Request code
            message: error.message,
            data: {}
        });
    }
}

// Userroutes
//use case 201
router.post('/api/user',validateUserCreateAssert, userController.create)

//use case 202 AF
router.get('/api/user/getall', userController.getAll)
router.get('/api/user/getall/active', userController.getAllActive)
router.get('/api/user/getall/inactive', userController.getAllInactive)

//use case 204
router.get('/api/user/:userId', userController.getById)

//use case 205
router.put('/api/user/:userId', validateUserCreateAssert, userController.updateUser)

//use case 206
router.delete('/api/users/:userId', userController.delete)

// Tijdelijke routes om niet bestaande routes op te vangen
router.put('/api/users/:userId', notFound)
router.delete('/api/users/:userId', notFound)

module.exports = router
