const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const helper = require('../src/util/helper')
chai.should()
chai.use(chaiHttp)
const expect = chai.expect

const endpointToTest = '/api/login'

describe('UC-101 Inloggen', () => {
    it('TC-101-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({})
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res.body.message).to.include(
                    'Missing required fields'
                )
                chai.expect(res.body.data).to.be.an('object').that.is.empty
                expect(res.body.data).to.not.have.property('token')

                done()
            })
    })

    it('TC-101-2 Niet-valide wachtwoord', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'get.test@example.com',
                password: 'notvalidpassword'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res.body.message).to.include(
                    'Invalid password format'
                )
                chai.expect(res.body.data).to.be.an('object').that.is.empty
                res.body.data.should.not.have.property('token')

                done()
            })
    })

    it('TC-101-3 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'notexisting.user@example.com',
                password: 'ValidPassword1'
            })
            .end((err, res) => {
                if (err) {
                    return done(err) // Finish the test with the error
                }

                chai.expect(res).to.have.status(404)
                chai.expect(res.body.message).to.include('User does not exist')
                chai.expect(res.body.data).to.be.an('object').that.is.empty
                res.body.data.should.not.have.property('token')

                done() // Finish the test
            })
    })

    it('TC-101-4 Gebruiker succesvol ingelogd', async () => {
        await helper.createTestUser('TC-101-1.test@example.com')

        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'TC-101-1.test@example.com',
                password: 'Validpassword1'
            })
            .end(async (err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body.message).to.include(
                    'User succesfully logged in'
                )
                chai.expect(res.body.data)
                const data = res.body.data
                data.should.have.property('id')
                data.should.have.property('emailAdress')
                data.should.have.property('firstName')
                data.should.have.property('lastName')
                data.should.have.property('token')

                await helper.deleteTestUser('TC-101-1.test@example.com')
            })
    })
})
