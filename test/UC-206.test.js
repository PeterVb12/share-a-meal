const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const userController = require('../src/controllers/user.controller.js')
const endpointToTest = '/api/user'
const jwt = require('../src/util/jwt')
const helper = require('../src/util/helper')

chai.should()
chai.use(chaiHttp)

describe('UC-206 Verwijderen van user', () => {
    it('TC-206-1 Gebruiker bestaat niet', (done) => {
        jwt.sign({ userId: -1 })
            .then((token) => {
                chai.request(server)
                    .delete(`${endpointToTest}/${-1}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        if (err) {
                            chai.expect.fail(err)
                        } else {
                            chai.expect(res).to.have.status(404)
                            chai.expect(res.body).to.be.an('object').that.is.not
                                .empty

                            chai.expect(res.body.message).to.include(
                                `User not found`
                            )

                            done()
                        }
                    })
            })
            .catch((error) => {
                done(error)
            })
    })

    it('TC-206-2 Gebruiker is niet ingelogd', async () => {
        const id = await helper.createTestUser('TC-206-2.test@example.com')
        jwt.sign({ userId: id }).then((token) => {
            chai.request(server)
                .delete(`${endpointToTest}/${id}`)
                .set('Authorization', `Bearer invalidtoken`)
                .end(async (err, res) => {
                    if (err) {
                        chai.expect.fail(err)
                    } else {
                        chai.expect(res).to.have.status(401)
                        chai.expect(res.body).to.be.an('object').that.is.not
                            .empty
                        chai.expect(res.body.message).to.include(
                            'Not valid token'
                        )

                        await helper.deleteTestUser('TC-206-2.test@example.com')
                    }
                })
        })
    })

    it('TC-206-3 De gebruiker is niet de eigenaar van de data', async () => {
        helper.createTestUser('TC-206-3.test@example.com')
        const id = await helper.createTestUser('TC-206-3.5.test@example.com')
        jwt.sign({ userId: id }).then((token) => {
            chai.request(server)
                .delete(`${endpointToTest}/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    if (err) {
                        chai.expect.fail(err)
                    } else {
                        chai.expect(res).to.have.status(403)
                        chai.expect(res.body).to.be.an('object').that.is.not
                            .empty
                        chai.expect(res.body.message).to.include(
                            `Not authorized`
                        )

                        await helper.deleteTestUser(
                            'TC-206-3.5.test@example.com'
                        )
                        await helper.deleteTestUser('TC-206-3.test@example.com')
                    }
                })
        })
    })

    it('TC-206-4 Gebruiker succesvol verwijderd', async () => {
        const id = await helper.createTestUser('TC-206-4.test@example.com')
        jwt.sign({ userId: id }).then((token) => {
            chai.request(server)
                .delete(`${endpointToTest}/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    if (err) {
                        chai.expect.fail(err)
                    } else {
                        chai.expect(res).to.have.status(200)
                        chai.expect(res.body).to.be.an('object').that.is.not
                            .empty
                        chai.expect(res.body.message).to.include(
                            `User with ID ${id} has been deleted`
                        )

                        await helper.deleteTestUser('TC-206-4.test@example.com')
                    }
                })
        })
    })
})
