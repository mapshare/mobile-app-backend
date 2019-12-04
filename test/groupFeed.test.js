require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /groupFeed route :', () => {
    var testUserId = 0;
    var testGroupId = 0;
    var testGroupId2 = 0;
    var testUsertoken1 = "";
    var testGroupFeedId = 0;


    before((done) => {
        chai.request(process.env.Test_URL)
            .post("/testregister")
            .send({
                "userEmail": "groupTest@test123.com",
                "userFirstName": "Group Test First Name",
                "userLastName": "Group Test Last Name",
                "userPassword": "myTestPassword1"
            })
            .end(function (err, res) {

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post("/login")
            .send({
                "userEmail": "groupTest@test123.com",
                "userPassword": "myTestPassword1"
            })
            .end(function (err, res) {
                testUsertoken1 = res.header.authentication;
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .get("/user")
            .set("authentication", testUsertoken1)
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
            .post('/groups')
            .set("authentication", testUsertoken1)
            .send({
                "groupName": "Test Group for Events One"
            })
            .end(function (err, res) {
                testGroupId = res.body._id;
                testGroupMemberId = res.body.groupMembers[0];
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groups')
            .set("authentication", testUsertoken1)
            .send({
                "groupName": "Test Group for Events Two"
            })
            .end(function (err, res) {
                testGroupId2 = res.body._id;
                testGroup2MemberId = res.body.groupMembers[0];
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/user')
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/groups/' + testGroupId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/groups/' + testGroupId2)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupRoles/' + testGroupRoleId)
            .end(function (err, res) {
                done();
            });
    });


    it('should CREATE a GroupFeed to the database PUT', (done) => {
        chai.request(process.env.Test_URL)
            .post('/groupFeed')
            .send({
                "group": testGroupId,
                "groupPosts": [{
                    "postTitle": "TestTitle",
                    "postContent": "TestContent",
                    "postCreatedBy": testUserId
                }]
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.group, testGroupId);
                assert.equal(res.body.groupPosts[0].postTitle, "TestTitle");
                assert.equal(res.body.groupPosts[0].postContent, "TestContent");
                assert.equal(res.body.groupPosts[0].postCreatedBy, testUserId);

                testGroupFeedId = res.body._id;

                done();
            });
    });


    it('Should READ ALL GroupFeed on /groupFeed GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupFeed')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    'groupPosts',
                    'group',
                    '__v');

                done();
            });
    });

    it('Should READ GroupFeed with the requested id on /groupFeed GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupFeed/' + testGroupFeedId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.group, testGroupId);

                done();
            });
    });

    it('Should UPDATE GroupFeed on /groupFeed PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/groupFeed/' + testGroupFeedId)
            .send({
                "group": testGroupId2,
                "groupPosts": [{
                    "postTitle": "TestTitle1",
                    "postContent": "TestContent1",
                    "postCreatedBy": testUserId
                }]
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.group, testGroupId2);
                assert.equal(res.body.success.groupPosts[0].postTitle, "TestTitle1");
                assert.equal(res.body.success.groupPosts[0].postContent, "TestContent1");
                assert.equal(res.body.success.groupPosts[0].postCreatedBy, testUserId);

                done();
            });
    });

    it('Should DELETE the groupFeed with the requested id on /groupFeed DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupFeed/' + testGroupFeedId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });
});