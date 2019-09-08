require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /Groups route :', () => {
    var testGroupId = 0;
    var testUserId = 0;

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/users')
            .send({
                "userEmail": "test@test.com",
                "userFirstName": "test",
                "userLastName": "Lasttest",
                "googleId": "12345",
                "userPicture": "1231231"
            })
            .end(function (err, res) {
                testUserId = res.body._id;

                done();
            });
    });

    after((done) => {
        // NOTE: SHOULD CALL REMOVE USER WHEN DELETE USER FUNCTION IS ADDED

        done();
    });

    it('should CREATE a Group POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/groups')
            .send({
                "userId": testUserId,
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

    it('Should READ ALL Restaurants on /groups GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groups')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    'groupMarks',
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
});