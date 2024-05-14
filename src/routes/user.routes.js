const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()  
const router = express.Router()
const userController = require('../controllers/user.controller')
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

const validateUserCreate = (req, res, next) => {
    try {
        assert(req.body.firstName, 'Missing or incorrect firstName field');
        chai.expect(req.body.firstName).to.not.be.empty;
        chai.expect(req.body.firstName).to.be.a('string');
        chai.expect(req.body.firstName).to.match(
            /^[a-zA-Z]+$/,
            'firstName must be a string'
        );
        
        // Validatie voor e-mailadres
        assert(req.body.emailAddress, 'Missing or incorrect email field');
        chai.expect(req.body.emailAddress).to.be.a('string');
        chai.expect(req.body.emailAddress).to.match(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Invalid email format'
        );

        // Validatie voor wachtwoord
        assert(req.body.password, 'Missing or incorrect password field');
        chai.expect(req.body.password).to.be.a('string');
        chai.expect(req.body.password.length).to.be.at.least(4, 'Password must be at least 4 characters long');

        // Validatie of gebruiker al bestaat
        // Implementeer de controle op de gebruiker bestaat al. 
        // Dit kan afhangen van je applicatielogica en database-interactie.

        logger.trace('User successfully validated');
        next();
    } catch (ex) {
        logger.trace('User validation failed:', ex.message);
        next({
            status: 400,
            message: ex.message,
            data: {}
        });
    }
};

// routes
//use case 201
router.post('/api/user',validateUserCreate, userController.create)
//use case 202
router.get('/api/user', userController.getAll)
router.get('/api/user/profile', validateToken, userController.getProfile)  //getprofile
router.get('/api/user/active', userController.getAllActive)
router.get('/api/user/inactive', userController.getAllInactive)
//use case 204
router.get('/api/user/:userId', userController.getById)
//use case 205
router.put('/api/user/:userId', validateUserCreate, userController.updateUser)
//use case 206
router.delete('/api/user/:userId', userController.delete)

// Tijdelijke routes om niet bestaande routes op te vangen
router.put('/api/user/:userId', notFound)
router.delete('/api/user/:userId', notFound)

module.exports = router
