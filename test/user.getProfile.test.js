const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/profile'

describe('UC203 Opvragen van gebruikersprofiel', () => {
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it('TC-203-1 Ongeldig token', (done) => {
        chai.request(server)
            .get(endpointToTest + '/profile')
            .set('Authorization', 'Bearer ongeldig_token')
            .end((err, res) => {
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Invalid token');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-203-2 Gebruiker is ingelogd met geldig token', (done) => {

        chai.request(server)
            .post('/api/auth/login') // Endpoint voor inloggen
            .send({
                email: 'gebruiker@email.com',
                password: 'wachtwoord'
            })
            .end((loginErr, loginRes) => {
                chai.expect(loginRes).to.have.status(200);
                const token = loginRes.body.token; // Verkrijg het JWT-token uit de response

                // Gebruik het verkregen token om het profiel van de gebruiker op te vragen
                chai.request(server)
                    .get(endpointToTest + '/profile')
                    .set('Authorization', `Bearer ${token}`)
                    .end((profileErr, profileRes) => {
                        chai.expect(profileRes).to.have.status(200);
                        chai.expect(profileRes.body).to.be.a('object');
                        chai.expect(profileRes.body).to.have.property('message').to.be.a('string');
                        chai.expect(profileRes.body.message).to.equal('Gebruikersprofiel opgehaald');
                        chai.expect(profileRes.body).to.have.property('data').to.be.an('object');
                        done();
                    });
            });
    });


})