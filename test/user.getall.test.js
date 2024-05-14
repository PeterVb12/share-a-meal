const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC201 Opvragen van overzicht van users', () => {
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => {
        chai.request(server)
            .get(endpointToTest)
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Alle gebruikers opgehaald');
                chai.expect(res.body).to.have.property('data').to.be.an('array').that.has.length.greaterThanOrEqual(2);
                done();
            });
    });

    it('TC-202-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
        chai.request(server)
            .get(endpointToTest + '?nonexistentField=searchTerm')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Geen gebruikers gevonden');
                chai.expect(res.body).to.have.property('data').to.be.an('array').that.is.empty;
                done();
            });
    });

    it('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=false', (done) => {
        chai.request(server)
            .get(endpointToTest + '?isActive=false')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Gebruikers met isActive=false opgehaald');
                chai.expect(res.body).to.have.property('data').to.be.an('array');
                done();
            });
    });

    it('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=true', (done) => {
        chai.request(server)
            .get(endpointToTest + '?isActive=true')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Gebruikers met isActive=true opgehaald');
                chai.expect(res.body).to.have.property('data').to.be.an('array');
                done();
            });
    });

    it('TC-202-5 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
        chai.request(server)
            .get(endpointToTest + '?field1=value1&field2=value2')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Gebruikers met zoektermen opgehaald');
                chai.expect(res.body).to.have.property('data').to.be.an('array');
                done();
            });
    });

    
})