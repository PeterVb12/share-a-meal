//
// Authentication routes
//
const express = require('express')
const chai = require('chai')
chai.should()
const authRoutes = express.Router()
const AuthController = require('../controllers/authentication.controller')
const loginMiddleware = require('../middlewares/login.middleware')

authRoutes.post('/login', loginMiddleware.validateLogin, AuthController.login)

module.exports = authRoutes
