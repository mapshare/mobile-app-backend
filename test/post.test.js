require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /post route :', () => {
    var testUserId = 0;
    var testGroupId = 0;
    var testGroupFeedId = 0;
    var testPostId = 0;

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/users')
            .send({
                "userEmail": "groupFeed@test.com",
                "userFirstName": "First test",
                "userLastName": "Last test",
                "googleId": "43463543",
                "userPicture": "543543"
            })
            .end(function (err, res) {
                testUserId = res.body._id;
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groups')
            .send({
                "userId": testUserId,
                "groupName": "Group Feed Test Group"
            })
            .end(function (err, res) {
                testGroupId = res.body._id;
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groupFeed')
            .send({
                "groupId": testGroupId
            })
            .end(function (err, res) {
                testGroupFeedId = res.body._id;
                done();
            });
    });


    it('should CREATE a Post to the database PUT', (done) => {
        chai.request(process.env.Test_URL)
            .post('/post')
            .send({
                "postTitle": "Test",
                "postContent": "Test Post Content",
                "groupFeedId": testGroupFeedId,
                "userId": testUserId
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.postTitle, "Test");
                assert.equal(res.body.postContent, "Test Post Content");
                assert.equal(res.body.groupFeedId, testGroupFeedId);
                assert.equal(res.body.userId, testUserId);

                testPostId = res.body._id;

                done();
            });
    });


    it('Should READ ALL Post on /Post GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/post')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    'postTitle',
                    'postContent',
                    'groupFeedId',
                    'userId',
                    '__v');

                done();
            });
    });

    it('Should READ Post with the requested id on /Post GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/post/' + testPostId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.postTitle, "Test");
                assert.equal(res.body.postContent, "Test Post Content");
                assert.equal(res.body.groupFeedId, testGroupFeedId);
                assert.equal(res.body.userId, testUserId);

                done();
            });
    });

    it('Should UPDATE Post on /Post PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/post/' + testPostId)
            .send({
                "postTitle": "Test 2",
                "postContent": "Test Post Content update",
                "groupFeedId": testGroupFeedId,
                "userId": testUserId
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                assert.equal(res.body.success.postTitle, "Test 2");
                assert.equal(res.body.success.postContent, "Test Post Content update");
                assert.equal(res.body.success.groupFeedId, testGroupFeedId);
                assert.equal(res.body.success.userId, testUserId);

                done();
            });
    });

    it('Should DELETE the Post with the requested id on /Post DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/post/' + testPostId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });
});