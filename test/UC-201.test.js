const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
chai.should()
chai.use(chaiHttp)
const userService = require('../src/services/user.service')
const helper = require('../src/util/helper')
const endpointToTest = '/api/user'

describe('UC-201 Registreren als nieuwe user', () => {
    it('TC-201-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({})
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res.body.message).to.include(
                    'Missing required fields'
                )
                chai.expect(res.body.data).to.be.an('object').that.is.empty
                done()
            })
    })

    it('TC-201-2 Niet-valide emailadress', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Get',
                lastName: 'Test',
                emailAdress: 'get.testexample.com',
                password: 'Validpassword1',
                phoneNumber: '0612345678',
                street: '123 Test Street',
                city: 'Test City'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res.body.message).to.include(
                    'Invalid emailadress format'
                )
                chai.expect(res.body.data).to.be.an('object').that.is.empty
                done()
            })
    })

    it('TC-201-3 Niet-valide wachtwoord', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Get',
                lastName: 'Test',
                emailAdress: 'get.test@example.com',
                password: 'notvalidpassword',
                phoneNumber: '0612345678',
                street: '123 Test Street',
                city: 'Test City'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res.body.message).to.include(
                    'Invalid password format'
                )
                chai.expect(res.body.data).to.be.an('object').that.is.empty
                done()
            })
    })

    it('TC-201-4 Gebruiker bestaat al', async () => {
        await helper.createTestUser('TC-201-4.test@example.com')

        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Get',
                lastName: 'Test',
                emailAdress: 'TC-201-4.test@example.com',
                password: 'Validpassword1',
                phoneNumber: '0612345678',
                street: '123 Test Street',
                city: 'Test City'
            })
            .end(async (err, res) => {
                chai.expect(res).to.have.status(403)
                chai.expect(res.body.message).to.include(
                    'Email address has already been used to create an account'
                )
                chai.expect(res.body.data).to.be.an('object').that.is.empty

                await helper.deleteTestUser('TC-201-4.test@example.com')
            })
    })

    it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Create',
                lastName: 'Test',
                emailAdress: 'TC-201-5.test@example.com',
                password: 'Validpassword1',
                phoneNumber: '0612345678',
                street: '123 Test Street',
                city: 'Test City'
            })
            .end(async (err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body.message).to.include(
                    'User created successfully'
                )
                chai.expect(res.body.data).to.be.an('object')
                const data = res.body.data
                data.should.have.property('id')
                data.should.have.property('firstName')
                data.should.have.property('lastName')
                data.should.have.property('isActive')
                data.should.have.property('emailAdress')
                data.should.have.property('password')
                data.should.have.property('phoneNumber')
                data.should.have.property('roles')
                data.should.have.property('street')
                data.should.have.property('city')

                await helper.deleteTestUser('TC-201-5.test@example.com')
                done()
            })
    })
})
