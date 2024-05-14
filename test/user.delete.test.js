const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/:userId'

describe('UC206 Verwijderen van user', () => {
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it('TC-206-1 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .delete(endpointToTest.replace(':userId', 'ongeldig_gebruiker_id')) // Vervang 'ongeldig_gebruiker_id' door een niet-bestaand gebruikers-ID
            .end((err, res) => {
                chai.expect(res).to.have.status(404);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('User not found');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-206-2 Gebruiker is niet ingelogd', (done) => {
        chai.request(server)
            .delete(endpointToTest.replace(':userId', '123')) // Vervang '123' door het ID van de gebruiker
            .end((err, res) => {
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Unauthorized: User not logged in');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-206-3 De gebruiker is niet de eigenaar van de data', (done) => {
        chai.request(server)
            .delete(endpointToTest.replace(':userId', '123')) // Vervang '123' door het ID van de gebruiker
            .end((err, res) => {
                chai.expect(res).to.have.status(403);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Unauthorized: User is not the owner of the data');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-206-4 Gebruiker succesvol verwijderd', (done) => {
        chai.request(server)
            .delete(endpointToTest.replace(':userId', '123')) // Vervang '123' door het ID van de gebruiker
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('User successfully deleted');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });
});