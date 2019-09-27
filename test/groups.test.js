require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /Groups route :', () => {
    var testGroupId = 0;
    var testUserId = 0;
    var testGroupRoleId = 0;

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/users')
            .send({
                "userEmail": "groupTest@test123.com",
                "userFirstName": "Group Test First Name",
                "userLastName": "Group Test Last Name",
                "googleId": "423423424234"
            })
            .end(function (err, res) {
                testUserId = res.body._id;

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groupRoles')
            .send({
                "groupRoleName": "Admin",
                "groupRolePermisionLevel": 3
            })
            .end(function (err, res) {
                testGroupRoleId = res.body._id;

                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/users/' + testUserId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupRoles/' + testGroupRoleId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

    it('should CREATE a Group POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/groups')
            .send({
                "userId": testUserId,
                "groupRole": testGroupRoleId,
                "groupName": "Test Group"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.groupName, "Test Group");

                testGroupId = res.body._id;

                done();
            });
    });

    it('Should READ ALL Groups on /groups GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groups')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    'groupDefaultCategory',
                    'groupCustomMarkCategory',
                    'groupMembers',
                    'groupName',
                    '__v');


                done();
            });
    });

    it('Should READ Group with the requested id on /groups GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groups/' + testGroupId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");
                assert.equal(res.body.groupName, "Test Group");

                done();
            });
    });

    it('Should UPDATE Group on /groups PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/groups/' + testGroupId)
            .send({
                "groupName": "New Test Group Name"
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.groupName, "New Test Group Name");

                done();
            });
    });

    it('Should DELETE the group from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/groups/' + testGroupId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });
});