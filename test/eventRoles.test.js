require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /eventRoles route :', () => {
    var testEventRoleId = 0;

    it('should CREATE a eventRole - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/eventRoles')
            .send({
                eventRoleName: "Member",
                eventRolePermisionLevel: 0
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.eventRoleName, "Member");
                assert.equal(res.body.eventRolePermisionLevel, 0);

                testEventRoleId = res.body._id;
                done();
            });
    });

    it('Should READ ALL eventRoles on /eventRoles - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/eventRoles')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    "eventRoleName",
                    "eventRolePermisionLevel",
                    '__v');

                done();
            });
    });

    it('Should READ group with the requested id on /eventRoles GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/eventRoles/' + testEventRoleId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testEventRoleId);

                done();
            });
    });

    it('Should UPDATE eventRole on /eventRoles PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/eventRoles/' + testEventRoleId)
            .send({
                eventRoleName: "Operator",
                eventRolePermisionLevel: 1
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.eventRoleName, "Operator");
                assert.equal(res.body.success.eventRolePermisionLevel, 1);

                done();
            });
    });

    it('Should DELETE the eventRoles from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/eventRoles/' + testEventRoleId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                
                done();
            });
    });

});