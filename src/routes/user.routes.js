const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()  
const router = express.Router()
const logger = require('../util/logger')

const userController = require('../controllers/user.controller')
const authMiddleware = require('../middleware/auth.middleware')
const userMiddleware = require('../middleware/user.middleware')

// routes
//use case 201
router.post('/user',
    userMiddleware.validateUserCreateMiddleware, 
    userController.create
)

//use case 202
router.get('/user', 
    userController.getAll
)

router.get('/user/profile', 
    authMiddleware.validateToken,
    userController.getProfile
)  
    
router.get('/user/active', 
    userController.getAllActive
)

router.get('/user/inactive', 
    userController.getAllInactive
)

//use case 204
router.get('/user/:userId',
    authMiddleware.validateToken,
    userController.getById
)

//use case 205
router.put('/user/:userId', 
    userMiddleware.validateUserUpdateMiddleware,
    authMiddleware.validateToken, 
    userController.updateUser)

//use case 206
router.delete('/user/:userId',
    authMiddleware.validateToken, 
    userController.delete
)

module.exports = router
