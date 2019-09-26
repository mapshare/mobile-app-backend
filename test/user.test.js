require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /users route :', () => {
    var testUserId = 0;

    it('should CREATE a user - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/users')
            .send({
                "userEmail": "test123@test123.com",
                "userFirstName": "Test First Name",
                "userLastName": "Test Last Name",
                "googleId": "432432",
                "userImages": { "userImageData": "Image1", "userImageContentType": "png" }
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.userEmail, "test123@test123.com");
                assert.equal(res.body.userFirstName, "Test First Name");
                assert.equal(res.body.userLastName, "Test Last Name");
                assert.equal(res.body.googleId, "432432");
                assert.equal(res.body.userImages[0].userImageContentType, "png");

                testUserId = res.body._id;

                done();
            });
    });

    it('Should READ ALL users on /users - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/users')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    "googleId",
                    "userCustomEventCategory",
                    "userCustomGroupCategory",
                    "userCustomLocationCategory",
                    "userCustomPostCategory",
                    "userEmail",
                    "userEvent",
                    "userFirstName",
                    "userGroup",
                    "userImages",
                    "userLastName",
                    "userPosts",
                    "userReviews",
                    '__v');

                done();
            });
    });

    it('Should READ user with the requested id on /users GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/users/' + testUserId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testUserId);

                done();
            });
    });

    it('Should UPDATE User on /users PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/users/' + testUserId)
            .send({
                "userEmail": "test456@test456.com",
                "userFirstName": "New First Name",
                "userLastName": "New Last Name",
                "googleId": "45454544"
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.userEmail, "test456@test456.com");
                assert.equal(res.body.success.userFirstName, "New First Name");
                assert.equal(res.body.success.userLastName, "New Last Name");
                assert.equal(res.body.success.googleId, "45454544");

                done();
            });
    });

    it('Should DELETE the users from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/users/' + testUserId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

});