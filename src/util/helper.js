const userController = require('../controllers/user.controller')
const userService = require('../services/user.service')
const mealService = require('../services/meal.service')

const helper = {
    createTestUser: async (email) => {
        return new Promise((resolve, reject) => {
            // Check if user with the provided email already exists
            userService.getUserByEmailAdress(
                email,
                false,
                (err, existingUser) => {
                    if (err) {
                        reject(err) // Reject if there's an error
                    } else if (existingUser) {
                        // User already exists, so resolve with their existing ID
                        resolve(existingUser.id)
                    } else {
                        // User does not exist, proceed with creating a new user
                        const userData = {
                            firstName: 'Test',
                            lastName: 'Account',
                            emailAdress: email,
                            password: 'Validpassword1',
                            phoneNumber: '0612345678',
                            street: '123 Test Street',
                            city: 'Test City'
                        }

                        userService.createUser(userData, (err, newUser) => {
                            if (err) {
                                reject(err) // Reject if there's an error during creation
                            } else {
                                resolve(newUser.id) // Resolve with the new user's ID
                            }
                        })
                    }
                }
            )
        })
    },

    deleteTestUser: (email) => {
        return new Promise((resolve, reject) => {
            userService.deleteUserByEmailAdress(email, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    },

    createTestMeal: async (mealData) => {
        return new Promise((resolve, reject) => {
            mealService.createMeal(null, mealData, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result.id)
                }
            })
        })
    }
}

module.exports = helper
