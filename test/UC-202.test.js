const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
chai.should()
chai.use(chaiHttp)
const jwt = require('../src/util/jwt')
const userService = require('../src/services/user.service')
const helper = require('../src/util/helper')
const endpointToTest = '/api/user'

describe('UC-202 Opvragen van overzicht van users', () => {
    it('TC-202-1 Toon alle gebruikers (minimaal 2)', async () => {
        let userId = await helper.createTestUser('TC-202-1.test@example.com')
        await helper.createTestUser('TC-202-1.1.test@example.com')

        jwt.sign({ userId: userId }).then((token) => {
            chai.request(server)
                .get(endpointToTest)
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(200)
                    chai.expect(res.body).to.be.an('object')
                    chai.expect(res.body.message).to.include('Users found')
                    chai.expect(res.body.data).to.be.an('array')
                    chai.expect(res.body.data.length).to.be.greaterThan(1)

                    await helper.deleteTestUser('TC-202-1.test@example.com')
                    await helper.deleteTestUser('TC-202-1.1.test@example.com')
                })
        })
    })

    it('TC-202-2 Toon gebruikers met zoekterm op niet-bestaande velden.', async () => {
        let userId = await helper.createTestUser('TC-202-2.test@example.com')
        await helper.createTestUser('TC-202-2.1.test@example.com')

        jwt.sign({ userId: userId }).then((token) => {
            chai.request(server)
                .get(endpointToTest)
                .query({ iscool: true })
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(400)
                    chai.expect(res.body).to.be.an('object')
                    chai.expect(res.body.message).to.include(
                        'Invalid query parameters'
                    )
                    await helper.deleteTestUser('TC-202-2.test@example.com')
                    await helper.deleteTestUser('TC-202-2.1.test@example.com')
                })
        })
    })

    it('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld isActive=false', async () => {
        let userId = await helper.createTestUser('TC-202-3.test@example.com')
        await helper.createTestUser('TC-202-3.1.test@example.com')

        jwt.sign({ userId: userId }).then((token) => {
            chai.request(server)
                .get(endpointToTest)
                .query({ isActive: false })
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(200)
                    chai.expect(res.body).to.be.an('object')
                    chai.expect(res.body.message).to.include('Users found')
                    chai.expect(res.body.data).to.be.an('array')

                    await helper.deleteTestUser('TC-202-3.test@example.com')
                    await helper.deleteTestUser('TC-202-3.1.test@example.com')
                })
        })
    })

    it('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld isActive=true', async () => {
        let userId = await helper.createTestUser('TC-202-4.test@example.com')
        await helper.createTestUser('TC-202-4.1.test@example.com')

        jwt.sign({ userId: userId }).then((token) => {
            chai.request(server)
                .get(endpointToTest)
                .query({ isActive: true })
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(200)
                    chai.expect(res.body).to.be.an('object')
                    chai.expect(res.body.message).to.include('Users found')
                    chai.expect(res.body.data).to.be.an('array')
                    chai.expect(res.body.data.length).to.be.greaterThan(1)

                    await helper.deleteTestUser('TC-202-4.test@example.com')
                    await helper.deleteTestUser('TC-202-4.1.test@example.com')
                })
        })
    })

    it('TC-202-5 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', async () => {
        let userId = await helper.createTestUser('TC-202-5.test@example.com')
        await helper.createTestUser('TC-202-5.1.test@example.com')

        jwt.sign({ userId: userId }).then((token) => {
            chai.request(server)
                .get(endpointToTest)
                .query({ street: '123 Test Street', city: 'Test City' })
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(200)
                    chai.expect(res.body).to.be.an('object')
                    chai.expect(res.body.message).to.include('Users found')
                    chai.expect(res.body.data).to.be.an('array')
                    chai.expect(res.body.data.length).to.be.greaterThan(1)

                    await helper.deleteTestUser('TC-202-5.test@example.com')
                    await helper.deleteTestUser('TC-202-5.1.test@example.com')
                })
        })
    })
})
