const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
chai.should()
chai.use(chaiHttp)
const jwt = require('../src/util/jwt')
const userService = require('../src/services/user.service')
const helper = require('../src/util/helper')
const endpointToTest = '/api/meal'

describe('UC-303 Opvragen van alle maaltijden', () => {
    it('TC-303-1 Lijst van maaltijden geretourneerd', async () => {
        let userId = await helper.createTestUser('TC-303-1.test@example.com')
        jwt.sign({ userId: userId }).then((token) => {
            chai.request(server)
                .get(endpointToTest)
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(200)
                    chai.expect(res.body).to.be.an('object')
                    chai.expect(res.body.data).to.be.an('array')
                    chai.expect(res.body.data.length).to.be.greaterThan(1)

                    await helper.deleteTestUser('TC-303-1.test@example.com')
                })
        })
    })
})
