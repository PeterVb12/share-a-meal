const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const jwt = require('../src/util/jwt')
const helper = require('../src/util/helper')

chai.should()
chai.use(chaiHttp)

const endpointToTest = '/api/user'

describe('UC-304 Opvragen van maaltijd bij ID', () => {
    it('TC-304-2 Details van maaltijd geretourneerd', async () => {
        let id = await helper.createTestUser('TC-304-2.test@example.com')
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
                .get(endpointToTest + `/${mealId}`)
                .set('Authorization', `Bearer ${token}`)
                .end(async (err, res) => {
                    chai.expect(res).to.have.status(200)
                    chai.expect(res.body).to.be.an('object')
                    chai.expect(res.body.message).to.include('Meal found')

                    await helper.deleteTestUser('TC-304-2.test@example.com')
                })
        })
    })
})
