const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
chai.should()
chai.use(chaiHttp)
const userService = require('../src/services/user.service')
const jwt = require('../src/util/jwt')
const helper = require('../src/util/helper')

const endpointToTest = '/api/user'

describe('UC-205 Updaten van usergegevens', () => {
    it('TC-205-1 Verplicht veld “emailAddress” ontbreekt', (done) => {
        jwt.sign({ userId: 1 }).then((token) => {
            chai.request(server)
                .put(endpointToTest)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'UpdatedUpdate',
                    lastName: 'UpdatedTest',
                    password: 'UpdatedValidpassword1',
                    phoneNumber: '0687654321',
                    street: 'Updated123 Test Street',
                    city: 'UpdatedTest City'
                })
                .end((err, res) => {
                    chai.expect(res).to.have.status(400)
                    chai.expect(res.body.message).to.include(
                        'Email address is required'
                    )
                    done()
                })
        })
    })

    it('TC-205-2 De gebruiker is niet de eigenaar van de data', async () => {
        helper.createTestUser('TC-205-2.test@example.com')
        const id = await helper.createTestUser('TC-205-2.5.test@example.com')

        jwt.sign({ userId: id }).then((token) => {
            chai.request(server)
                .put(endpointToTest)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'UpdatedUpdate',
                    lastName: 'UpdatedTest',
                    emailAdress: 'TC-205-2.test@example.com',
                    password: 'UpdatedValidpassword1',
                    phoneNumber: '0687654321',
                    street: 'Updated123 Test Street',
                    city: 'UpdatedTest City'
                })
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(403)
                    chai.expect(res.body.message).to.include('Not authorized')

                    await helper.deleteTestUser('TC-205-2.test@example.com')
                    await helper.deleteTestUser('TC-205-2.5.test@example.com')
                })
        })
    })

    it('TC-205-3 Niet-valide telefoonnummer', (done) => {
        jwt.sign({ userId: 2 }).then((token) => {
            chai.request(server)
                .put(endpointToTest)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'UpdatedUpdate',
                    lastName: 'UpdatedTest',
                    emailAdress: 'update.test@example.com',
                    password: 'UpdatedValidpassword1',
                    phoneNumber: '12345',
                    street: 'Updated123 Test Street',
                    city: 'UpdatedTest City'
                })
                .end((err, res) => {
                    chai.expect(res).to.have.status(400)
                    chai.expect(res.body.message).to.include(
                        'Invalid phone number format'
                    )
                    done()
                })
        })
    })

    it('TC-205-4 Gebruiker bestaat niet', (done) => {
        jwt.sign({ userId: -1 }).then((token) => {
            chai.request(server)
                .put(endpointToTest)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'UpdatedUpdate',
                    lastName: 'UpdatedTest',
                    emailAdress: 'not.existing@example.com',
                    password: 'UpdatedValidpassword1',
                    phoneNumber: '0687654321',
                    street: 'Updated123 Test Street',
                    city: 'UpdatedTest City'
                })
                .end((err, res) => {
                    chai.expect(res).to.have.status(404)
                    chai.expect(res.body.message).to.include('User not found')
                    done()
                })
        })
    })

    it('TC-205-5 Niet ingelogd', async () => {
        const id = await helper.createTestUser('TC-205-5.test@example.com')
        await jwt.sign({ userId: id }).then((token) => {
            chai.request(server)
                .put(endpointToTest)
                .send({
                    firstName: 'UpdatedUpdate',
                    lastName: 'UpdatedTest',
                    emailAdress: 'TC-205-5@example.com',
                    password: 'UpdatedValidpassword1',
                    phoneNumber: '0687654321',
                    street: 'Updated123 Test Street',
                    city: 'UpdatedTest City'
                })
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(401)
                    chai.expect(res.body.message).to.include('Not logged in')
                    chai.expect(res.body.data).to.be.an('object').that.is.empty

                    await helper.deleteTestUser('TC-205-5.test@example.com')
                })
        })
    })

    it('TC-205-6 Gebruiker succesvol gewijzigd', async () => {
        const id = await helper.createTestUser('TC-205-6.test@example.com')
        jwt.sign({ userId: id }).then((token) => {
            chai.request(server)
                .put(endpointToTest)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'UpdatedUpdate',
                    lastName: 'UpdatedTest',
                    emailAdress: 'TC-205-6.test@example.com',
                    password: 'UpdatedValidpassword1',
                    phoneNumber: '0687654321',
                    street: 'Updated123 Test Street',
                    city: 'UpdatedTest City'
                })
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(200)
                    chai.expect(res.body.message).to.include(
                        'User data updated successfully'
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

                    await helper.deleteTestUser('TC-205-6.test@example.com')
                })
        })
    })
})
