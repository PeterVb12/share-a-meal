const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const jwt = require('../src/util/jwt')
const helper = require('../src/util/helper')

chai.should()
chai.use(chaiHttp)

const endpointToTest = '/api/user'

describe('UC-204: Opvragen van usergegevens bij ID', () => {
    it('TC-204-1 Ongeldig token', (done) => {
        jwt.sign({ userId: 1 })
            .then((token) => {
                chai.request(server)
                    .get(endpointToTest + '/1')
                    .set('Authorization', 'Bearer 123')
                    .end((err, res) => {
                        chai.expect(res).to.have.status(401)
                        chai.expect(res.body).to.be.an('object')
                        chai.expect(res.body.message).to.include(
                            'Not valid token'
                        )
                        // check if data is empty object
                        chai.expect(res.body.data).to.be.an('object').that.is
                            .empty
                        done()
                    })
            })
            .catch((error) => {
                done(error)
            })
    })

    it('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
        jwt.sign({ userId: -1 })
            .then((token) => {
                chai.request(server)
                    .get(endpointToTest + '/-1')
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        chai.expect(res).to.have.status(404)
                        chai.expect(res.body).to.be.an('object')
                        chai.expect(res.body.message).to.include(
                            'User not found'
                        )
                        chai.expect(res.body.data).to.be.an('object').that.is
                            .empty
                        done()
                    })
            })
            .catch((error) => {
                done(error)
            })
    })

    it('TC-204-3 Gebruiker-ID bestaat', async () => {
        let userId = await helper.createTestUser('TC-204-3.test@example.com')
        jwt.sign({ userId: userId }).then((token) => {
            chai.request(server)
                .get(endpointToTest + `/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(200)
                    chai.expect(res.body).to.be.an('object')
                    chai.expect(res.body.message).to.include('User found')
                    const data = res.body.data
                    data.should.have.property('id')
                    data.should.have.property('firstName')
                    data.should.have.property('lastName')
                    data.should.have.property('isActive')
                    data.should.have.property('emailAdress')
                    data.should.have.property('phoneNumber')
                    data.should.have.property('roles')
                    data.should.have.property('street')
                    data.should.have.property('city')

                    await helper.deleteTestUser('TC-204-3.test@example.com')
                })
        })
    })
})
