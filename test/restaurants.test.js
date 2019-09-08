require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /Restaurants route :', () => {
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

  it('should CREATE a restaurant to the database PUT', (done) => {
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
        assert.equal(res.status, 201);
        assert.equal(res.type, 'application/json', "Response should be json");

        assert.equal(res.body.groupId, testGroupId);
        assert.equal(res.body.restaurantName, "Test Restaurant Name");
        assert.equal(res.body.restaurantLocation, "Test Restaurant Location");
        assert.equal(res.body.restaurantCuisine, "Test Restaurant Cuisine");
        assert.equal(res.body.restaurantPriceRange, "$");
        testLocationId = res.body.locationId;
        done();
      });
  });

  it('Should READ ALL Restaurants on /restaurants GET', (done) => {

    chai.request(process.env.Test_URL)
      .get('/restaurants')
      .end(function (err, res) {

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body[0]).to.have.all.keys(
          '_id',
          'groupId',
          'locationId',
          'restaurantName',
          'restaurantLocation',
          'restaurantCuisine',
          'restaurantPriceRange',
          'restaurantReviews',
          '__v');


        done();
      });
  });

  it('Should READ Restaurant with the requested id on /restaurants GET', (done) => {

    chai.request(process.env.Test_URL)
      .get('/restaurants/' + testLocationId)
      .end(function (err, res) {

        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json', "Response should be json");
        assert.equal(res.body.groupId, testGroupId);
        assert.equal(res.body.restaurantName, "Test Restaurant Name");
        assert.equal(res.body.restaurantLocation, "Test Restaurant Location");
        assert.equal(res.body.restaurantCuisine, "Test Restaurant Cuisine");
        assert.equal(res.body.restaurantPriceRange, "$");

        done();
      });
  });

  it('Should UPDATE Restaurants on /restaurants PUT', (done) => {
    chai.request(process.env.Test_URL)
      .put('/restaurants/' + testLocationId)
      .send({
        "userId": testUserId,
        "restaurantName": "Restaurant New Name",
        "restaurantLocation": "Location New Name",
        "priceRange": "$",
        "groupId": testGroupId
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;

        assert.equal(res.body.success.groupId, testGroupId);
        assert.equal(res.body.success.restaurantName, "Restaurant New Name");
        assert.equal(res.body.success.restaurantLocation, "Location New Name");
        assert.equal(res.body.success.restaurantPriceRange, "$");
        done();
      });
  });

  it('Should DELETE the first restaurant from database DELETE', (done) => {
    chai.request(process.env.Test_URL)
      .delete('/restaurants/' + testLocationId)
      .send({ "userId": testUserId })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
});