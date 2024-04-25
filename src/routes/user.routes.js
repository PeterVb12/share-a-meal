const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')


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
        assert(user.name, 'Naam is vereist');
        assert(user.email, 'E-mail is vereist');
        assert(user.password, 'Wachtwoord is vereist');
        
        // Extra validatievoorwaarden kunnen hier worden toegevoegd met assert

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
router.post('/api/users',validateUserCreateAssert, userController.create)
router.get('/api/users', userController.getAll)
router.get('/api/users/:userId', userController.getById)

// Tijdelijke routes om niet bestaande routes op te vangen
router.put('/api/users/:userId', notFound)
router.delete('/api/users/:userId', notFound)

module.exports = router
