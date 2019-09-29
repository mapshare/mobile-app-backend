require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /groupMember route :', () => {
    var testGroupMemberId = 0;
    var testUserId = 0
    var testGroupId = 0
    var testGroupRoleId = 0;
    var testGroupRoleId2 = 0;

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

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groupRoles')
            .send({
                "groupRoleName": "Member",
                "groupRolePermisionLevel": 0
            })
            .end(function (err, res) {
                testGroupRoleId2 = res.body._id;

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groups')
            .send({
                "userId": testUserId,
                "groupName": "User Group Test Group",
                "groupRole": testGroupRoleId
            })
            .end(function (err, res) {
                testGroupId = res.body._id;

                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/users/' + testUserId)
            .end(function (err, res) {
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/groups/' + testGroupId)
            .end(function (err, res) {
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

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupRoles/' + testGroupRoleId2)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });


    it('should CREATE a groupMember - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/groupMember')
            .send({
                user: testUserId,
                group: testGroupId,
                groupMemberRole: testGroupRoleId2
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.user, testUserId);
                assert.equal(res.body.group, testGroupId);
                assert.equal(res.body.groupMemberRole, testGroupRoleId2);

                testGroupMemberId = res.body._id;
                done();
            });
    });

    it('Should READ ALL groupMember on /groupMember - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupMember')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    "_id",
                    "group",
                    "user",
                    "groupMemberEvent",
                    "groupMemberMarks",
                    "groupMemberPosts",
                    "groupMemberReviews",
                    "groupMemberRole",
                    "__v");

                done();
            });
    });

    it('Should READ groupMember with the requested id on /groupMember GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupMember/' + testGroupMemberId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testGroupMemberId);

                done();
            });
    });

    it('Should UPDATE groupMember on /groupMember PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/groupMember/' + testGroupMemberId)
            .send({
                user: testUserId,
                group: testGroupId,
                groupMemberRole: testGroupRoleId
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.user, testUserId);
                assert.equal(res.body.success.group, testGroupId);
                assert.equal(res.body.success.groupMemberRole, testGroupRoleId);

                done();
            });
    });

    it('Should DELETE the groupMember from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupMember/' + testGroupMemberId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

});