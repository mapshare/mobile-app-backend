require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /groupRoles route :', () => {
    var testGroupRoleId = 0;

    it('should CREATE a groupRole - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/groupRoles')
            .send({
                groupRoleName: "Member",
                groupRolePermisionLevel: 0
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.groupRoleName, "Member");
                assert.equal(res.body.groupRolePermisionLevel, 0);

                testGroupRoleId = res.body._id;
                done();
            });
    });

    it('Should READ ALL groupRoles on /groupRoles - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupRoles')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    "groupRoleName",
                    "groupRolePermisionLevel",
                    '__v');

                done();
            });
    });

    it('Should READ group with the requested id on /groupRoles GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupRoles/' + testGroupRoleId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testGroupRoleId);

                done();
            });
    });

    it('Should UPDATE groupRole on /groupRoles PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/groupRoles/' + testGroupRoleId)
            .send({
                groupRoleName: "Operator",
                groupRolePermisionLevel: 1
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.groupRoleName, "Operator");
                assert.equal(res.body.success.groupRolePermisionLevel, 1);

                done();
            });
    });

    it('Should DELETE the groupRoles from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupRoles/' + testGroupRoleId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                
                done();
            });
    });

});