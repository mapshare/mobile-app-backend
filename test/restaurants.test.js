require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /Restaurants route :', () => {
  it('should add a restaurant to the database PUT', (done) =>{
    chai.request(process.env.Test_URL)
    .post('/restaurants')
    // Test Data
    .send([
    {restaurantName: 'test'},
    {restaurantLocation: 'test'},
    {restaurantCuisine: 'test'},
    {restaurantPriceRange: 'test'}])
    .end(function(err,res){
        assert.equal(res.status,200);
        assert.equal(res.type,'application/json', "Response should be json");
    
        assert.equal(res.body.locationId, '1');
        assert.equal(res.body.groupId, '1');
        assert.equal(res.body.restaurantName, '1');
        assert.equal(res.body.restaurantLocation, '1');
        assert.equal(res.body.restaurantCuisine, '1');
        assert.equal(res.body.restaurantPriceRange, '1');
        assert.equal(res.body.restaurantReviews, []);

        done();
    });
  });

  it('Should LIST ALL Restaurants on /restaurants GET', (done) => {

    chai.request(process.env.Test_URL)
      .get('/restaurants')
      .end(function(err, res) {

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body[0]).to.have.all.keys(
          'locationId', 
          'groupId',
          'restaurantName',
          'restaurantLocation',
          'restaurantCuisine',
          'restaurantPriceRange',
          'restaurantReviews');
        expect(res.body[0].text).to.be.a('string');

        done();
      });
  });


});