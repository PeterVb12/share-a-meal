const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
chai.should()
chai.use(chaiHttp)
const jwt = require('../src/util/jwt')
const helper = require('../src/util/helper')

const endpointToTest = '/api/user/profile'

describe('UC-203 Opvragen van gebruikersprofiel', () => {
    it('TC-203-1 Ongeldig token', (done) => {
        jwt.sign({ userId: 1 })
            .then((token) => {
                chai.request(server)
                    .get(endpointToTest)
                    .set('Authorization', `Bearer incorrectToken`)
                    .end((err, res) => {
                        chai.expect(res).to.have.status(401)
                        chai.expect(res.body).to.be.an('object')
                        chai.expect(res.body.message).to.include(
                            'Not valid token'
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

    it('TC-203-2 Gebruiker-ID bestaat', async () => {
        let userId = await helper.createTestUser('TC-203-2.test@example.com')

        jwt.sign({ userId: userId }).then((token) => {
            chai.request(server)
                .get(endpointToTest)
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

                    await helper.deleteTestUser('TC-203-2.test@example.com')
                })
        })
    })
})
