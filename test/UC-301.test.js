const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const userController = require('../src/controllers/user.controller.js')
const jwt = require('../src/util/jwt')
const helper = require('../src/util/helper')

chai.use(chaiHttp)

const endpointToTest = '/api/meal'

describe('UC-206 Verwijderen van user', () => {
    it('TC-301-1 Maaltijd succesvol toegevoegd', async () => {
        chai.request(server)
            .post(endpointToTest)
            .set('Authorization', `Bearer ${'randomtoken'}`)
            .send({})
            .end(async (err, res) => {
                if (err) {
                    chai.expect.fail(err)
                } else {
                    chai.expect(res).to.have.status(400)
                    chai.expect(res.body).to.be.an('object')
                }
            })
    })

    it('TC-301-2 Maaltijd succesvol toegevoegd', async () => {
        chai.request(server)
            .post(endpointToTest)
            .set('Authorization', `Bearer ${'randomtoken'}`)
            .send({
                isActive: 1,
                isVega: 1,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: '2024-05-14 18:00:00',
                maxAmountOfParticipants: 10,
                price: 12.5,
                imageUrl: 'http://example.com/image.jpg',
                name: 'Test Meal',
                description: 'A delicious test meal.',
                allergenes: 'gluten,lactose'
            })
            .end(async (err, res) => {
                if (err) {
                    chai.expect.fail(err)
                } else {
                    chai.expect(res).to.have.status(401)
                    chai.expect(res.body).to.be.an('object')
                }
            })
    })

    it('TC-301-3 Maaltijd succesvol toegevoegd', async () => {
        try {
            const id = await helper.createTestUser('TC-301-3.test@example.com')
            const token = await jwt.sign({ userId: id })

            chai.request(server)
                .post(endpointToTest)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    isActive: 1,
                    isVega: 1,
                    isVegan: 0,
                    isToTakeHome: 1,
                    dateTime: '2024-05-14 18:00:00',
                    maxAmountOfParticipants: 10,
                    price: 12.5,
                    imageUrl: 'http://example.com/image.jpg',
                    name: 'Test Meal',
                    description: 'A delicious test meal.',
                    allergenes: 'gluten,lactose'
                })
                .end(async (err, res) => {
                    if (err) {
                        chai.expect.fail(err)
                    } else {
                        chai.expect(res).to.have.status(201)
                        chai.expect(res.body).to.be.an('object').that.is.not
                            .empty

                        await helper.deleteTestUser('TC-301-3.test@example.com')
                    }
                })
        } catch (error) {
            chai.expect.fail(error)
        }
    })
})
