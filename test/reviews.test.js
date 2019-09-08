require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /reviews route :', () => {
    var testLocationId = 0;
    var testUserId = 0;
    var testGroupId = 0;

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

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groups')
            .send({
                "userId": testUserId,
                "groupName": "Test Group"
            })
            .end(function (err, res) {
                testGroupId = res.body._id;
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/restaurants')
            .send({
                "userId": testUserId,
                "groupId": testGroupId,
                "geometry": { "coordinates": [0.5, 0.5] },
                "restaurantName": "Test Restaurant Name",
                "restaurantLocation": "Test Restaurant Location",
                "restaurantCuisine": "Test Restaurant Cuisine",
                "priceRange": "$"
            })
            .end(function (err, res) {
                testLocationId = res.body.locationId;
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/restaurants/' + testLocationId)
            .send({ "userId": "5d74270ba2c6a64de821fd01" })
            .end(function (err, res) {
                done();
            });
    });

    it('should CREATE a review on the database PUT', (done) => {
        chai.request(process.env.Test_URL)
            .post('/reviews')
            .send({
                "locationId": testLocationId,
                "reviewUser": { "userId": testUserId },
                "reviewRating": "5",
                "reviewContent": "Test Review"
            })
            .end(function (err, res) {
                assert.equal(res.status, 201);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.locationId, testLocationId);
                assert.equal(res.body.reviewUser.userId, testUserId);
                assert.equal(res.body.reviewRating, "5");
                assert.equal(res.body.reviewContent, "Test Review");

                testLocationId = res.body.locationId;

                done();
            });
    });


    it('Should READ reviews for selected location /reviews GET', (done) => {

        chai.request(process.env.Test_URL)
            .get('/reviews?locationId=' + testLocationId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.all.keys(
                    "locationId",
                    "restaurantCuisine",
                    "restaurantLocation",
                    "restaurantName",
                    "restaurantPriceRange",
                    "restaurantReviews"
                );

                done();
            });
    });

});