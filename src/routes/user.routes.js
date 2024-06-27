const express = require('express')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const userMiddleware = require('../middlewares/user.middleware')

router.post(
    '/user',
    userMiddleware.validateUserCreateMiddleware,
    userController.createUser
)

router.get(
    '/user/profile',
    authMiddleware.validateToken,
    userController.getUserById
)

router.delete(
    '/user/:userId',
    authMiddleware.validateToken,
    userController.deleteUserbyId
)

router.put(
    '/user',
    userMiddleware.validateUserUpdateMiddleware,
    authMiddleware.validateToken,
    userController.updateUser
)

router.get(
    '/user/:userId',
    authMiddleware.validateToken,
    userController.getUserById
)

router.get(
    '/user',
    authMiddleware.validateToken,
    userMiddleware.validateParamsMiddleware,
    (req, res, next) => {
        if (Object.keys(req.query).length > 0) {
            userController.getUserByField(req, res, next)
        } else {
            userController.getAll(req, res, next)
        }
    }
)

module.exports = router
