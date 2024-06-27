const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const userController = require('../src/controllers/user.controller.js')
const endpointToTest = '/api/user'
const jwt = require('../src/util/jwt')
const helper = require('../src/util/helper')

chai.should()
chai.use(chaiHttp)

describe('UC-305 Verwijderen van maaltijd', () => {
    it('TC-305-1 Niet ingelogd', async () => {
        jwt.sign({ userId: 1 }).then((token) => {
            chai.request(server)
                .delete(`${endpointToTest}/${mealId}`)
                .end(async (err, res) => {
                    if (err) {
                        chai.expect.fail(err)
                    } else {
                        chai.expect(res).to.have.status(401)
                        chai.expect(res.body).to.be.an('object').that.is.not
                            .empty

                        await helper.deleteTestUser('TC-305-1.test@example.com')
                    }
                })
        })
    })

    it('TC-305-2 Niet de eigenaar van de data', async () => {
        let id = await helper.createTestUser('TC-305-2.test@example.com')
        let secondId = await helper.createTestUser(
            'TC-305-2.5.test@example.com'
        )
        let mealId = await helper.createTestMeal({
            isActive: true,
            isVega: false,
            isVegan: false,
            isToTakeHome: true,
            dateTime: '2024-06-01T18:30:00',
            maxAmountOfParticipants: 10,
            price: 25.5,
            imageUrl: 'https://example.com/images/meal.jpg',
            name: 'Delicious Meal',
            description: 'A very delicious meal with fresh ingredients.',
            allergenes: 'gluten',
            cookId: id
        })

        jwt.sign({ userId: secondId }).then((token) => {
            chai.request(server)
                .delete(`${endpointToTest}/${mealId}`)
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    if (err) {
                        chai.expect.fail(err)
                    } else {
                        chai.expect(res).to.have.status(403)
                        chai.expect(res.body).to.be.an('object').that.is.not
                            .empty

                        await helper.deleteTestUser('TC-305-2.test@example.com')
                        await helper.deleteTestUser(
                            'TC-305-2.5.test@example.com'
                        )
                    }
                })
        })
    })

    it('TC-305-3 Maaltijd bestaat niet', async () => {
        const id = await helper.createTestUser('TC-305-3.test@example.com')
        jwt.sign({ userId: id }).then((token) => {
            chai.request(server)
                .delete(`${endpointToTest}/${-1}`)
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    if (err) {
                        chai.expect.fail(err)
                    } else {
                        chai.expect(res).to.have.status(404)
                        chai.expect(res.body).to.be.an('object').that.is.not
                            .empty

                        await helper.deleteTestUser('TC-305-3.test@example.com')
                    }
                })
        })
    })

    it('TC-305-4 Maaltijd succesvol verwijderd', async () => {
        const id = await helper.createTestUser('TC-305-4.test@example.com')
        let mealId = await helper.createTestMeal({
            isActive: true,
            isVega: false,
            isVegan: false,
            isToTakeHome: true,
            dateTime: '2024-06-01T18:30:00',
            maxAmountOfParticipants: 10,
            price: 25.5,
            imageUrl: 'https://example.com/images/meal.jpg',
            name: 'Delicious Meal',
            description: 'A very delicious meal with fresh ingredients.',
            allergenes: 'gluten',
            cookId: id
        })

        jwt.sign({ userId: id }).then((token) => {
            chai.request(server)
                .delete(`${endpointToTest}/${mealId}`)
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    if (err) {
                        chai.expect.fail(err)
                    } else {
                        chai.expect(res).to.have.status(200)
                        chai.expect(res.body).to.be.an('object').that.is.not
                            .empty

                        await helper.deleteTestUser('TC-305-4.test@example.com')
                    }
                })
        })
    })
})
