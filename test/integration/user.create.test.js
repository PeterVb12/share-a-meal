import { should as _should, use, request } from 'chai';
import chai from 'chai'
import chaiHttp from 'chai-http';
import server from '../index';
const should = _should();

use(chaiHttp);
 
describe('UC-202 Opvragen van overzicht van users', () => {
    it('TC-202-1 Toon alle gebruikers', (done) => {
        request(server)
            .get('/api/user')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').that.is.a('string');
                res.body.should.have.property('data').that.is.an('array').with.lengthOf.at.least(2);
 
                done();
            });
    });
});