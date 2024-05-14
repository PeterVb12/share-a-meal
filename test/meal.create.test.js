const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/meal'

describe('UC301 Toevoegen van maaltijd', () => {
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it('TC-301-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post('/api/meal')
            .send({
                // Verplicht veld ontbreekt, bijvoorbeeld 'name'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Missing required field: name');
                chai.expect(res.body).to.have.property('data').to.be.null;
                done();
            });
    });

    it('TC-301-2 Niet ingelogd', (done) => {
        chai.request(server)
            .post('/api/meal')
            .send({
                // Voeg gegevens van de maaltijd toe
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

    it('TC-301-3 Maaltijd succesvol toegevoegd', (done) => {
        chai.request(server)
            .post('/api/meal')
            .send({
                // Voeg gegevens van de maaltijd toe
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('message').to.be.a('string');
                chai.expect(res.body.message).to.equal('Meal successfully added');
                chai.expect(res.body).to.have.property('data').to.be.an('object');
                done();
            });
    });
});