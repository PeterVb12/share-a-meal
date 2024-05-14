const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/:userId'

describe('UC204 Opvragen van gebruikersprofiel', () => {
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it('TC-204-1 Ongeldig token', (done) => {
        chai.request(server)
            .get(endpointToTest.replace(':userId', '1')) 
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

    it('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
        chai.request(server)
            .get(endpointToTest.replace(':userId', 'ongeldig_gebruiker_id'))
            .end((err, res) => {
                chai.expect(res).to.have.status(404);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Gebruiker niet gevonden');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-204-3 Gebruiker-ID bestaat', (done) => {

        const userId = '1';

        chai.request(server)
            .get(endpointToTest.replace(':userId', userId))
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Gebruikersprofiel opgehaald');
                chai.expect(res.body).to.have.property('data').to.be.an('object');
                done();
            });
    });

})