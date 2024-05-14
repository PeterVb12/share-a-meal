const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/:userId'

describe('UC205 Opvragen van gebruikersprofiel', () => {
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it('TC-205-1 Verplicht veld “emailAddress” ontbreekt', (done) => {
        chai.request(server)
            .put(endpointToTest.replace(':userId', '123')) // Vervang '123' door het ID van de gebruiker
            .send({
                // Geen emailAddress opgegeven
                // Voeg andere velden toe die vereist zijn voor de gebruiker update
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Missing or incorrect emailAddress field');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-205-2 De gebruiker is niet de eigenaar van de data', (done) => {
        chai.request(server)
            .put(endpointToTest.replace(':userId', '123')) // Vervang '123' door het ID van de gebruiker
            .send({
                // Voeg gegevens toe om te updaten
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(403);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                // Specifiek foutbericht voor deze testcase
                chai.expect(res.body.message).to.equal('Unauthorized: User is not the owner of the data');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-205-3 Niet-valide telefoonnummer', (done) => {
        chai.request(server)
            .put(endpointToTest.replace(':userId', '123')) // Vervang '123' door het ID van de gebruiker
            .send({
                // Voeg gegevens toe om te updaten, inclusief een niet-valide telefoonnummer
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Invalid phoneNumber format');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-205-4 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .put(endpointToTest.replace(':userId', 'ongeldig_gebruiker_id')) // Vervang 'ongeldig_gebruiker_id' door een niet-bestaand gebruikers-ID
            .send({
                // Voeg gegevens toe om te updaten
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(404);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('User not found');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-205-5 Niet ingelogd', (done) => {
        chai.request(server)
            .put(endpointToTest.replace(':userId', '123')) // Vervang '123' door het ID van de gebruiker
            .send({
                // Voeg gegevens toe om te updaten
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Unauthorized: User not logged in');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-205-6 Gebruiker succesvol gewijzigd', (done) => {
        chai.request(server)
            .put(endpointToTest.replace(':userId', '123')) // Vervang '123' door het ID van de gebruiker
            .send({
                // Voeg gegevens toe om te updaten
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('User successfully updated');
                chai.expect(res.body).to.have.property('data').to.be.an('object');
                done();
            });
    });
})    