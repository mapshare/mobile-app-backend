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
    var testGroupFeedId = 0;

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
            .post('/groups')
            .send({
                "userId": testUserId,
                "groupName": "Group Feed Test Group 2"
            })
            .end(function (err, res) {
                testGroupId2 = res.body._id;
                done();
            });
    });


    it('should CREATE a GroupFeed to the database PUT', (done) => {
        chai.request(process.env.Test_URL)
            .post('/groupFeed')
            .send({
                "groupId": testGroupId
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.groupId, testGroupId);

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
                    'groupId',
                    'postsId',
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

                assert.equal(res.body.groupId, testGroupId);

                done();
            });
    });

    it('Should UPDATE GroupFeed on /groupFeed PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/groupFeed/' + testGroupFeedId)
            .send({
                "groupId": testGroupId2
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.groupId, testGroupId2);

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