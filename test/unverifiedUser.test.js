require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /unverifiedUser route :', () => {
  var testUnverifiedUser = 0;

  it('should CREATE a unverifiedUser to the database PUT', (done) => {
    chai.request(process.env.Test_URL)
      .post('/unverifiedUser')
      .send({
        "unverifiedUserEmail": "testEmail@email.ca",
        "unverifiedUserFirstName": "TESTFirstName",
        "unverifiedUserLastName": "TESTLastName"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json', "Response should be json");

        assert.equal(res.body.unverifiedUserEmail, "testEmail@email.ca");
        assert.equal(res.body.unverifiedUserFirstName, "TESTFirstName");
        assert.equal(res.body.unverifiedUserLastName, "TESTLastName");

        testUnverifiedUser = res.body._id;

        done();
      });
  });

  it('Should READ ALL unverifiedUser on /unverifiedUser GET', (done) => {
    chai.request(process.env.Test_URL)
      .get('/unverifiedUser')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');

        expect(res.body[0]).to.have.all.keys(
          '_id',
          'unverifiedUserEmail',
          'unverifiedUserFirstName',
          'unverifiedUserLastName',
          '__v');

        done();
      });
  });

  it('Should READ unverifiedUser with the requested id on /unverifiedUser GET', (done) => {
    chai.request(process.env.Test_URL)
      .get('/unverifiedUser/' + testUnverifiedUser)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json', "Response should be json");

        assert.equal(res.body.unverifiedUserEmail, "testEmail@email.ca");
        assert.equal(res.body.unverifiedUserFirstName, "TESTFirstName");
        assert.equal(res.body.unverifiedUserLastName, "TESTLastName");

        done();
      });
  });

  it('Should UPDATE unverifiedUser on /unverifiedUser PUT', (done) => {
    chai.request(process.env.Test_URL)
      .put('/unverifiedUser/' + testUnverifiedUser)
      .send({
        "unverifiedUserEmail": "testEmail@email.ca",
        "unverifiedUserFirstName": "TESTUpdateFirstName",
        "unverifiedUserLastName": "TESTUpdateLastName"
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;

        assert.equal(res.body.success.unverifiedUserEmail, "testEmail@email.ca");
        assert.equal(res.body.success.unverifiedUserFirstName, "TESTUpdateFirstName");
        assert.equal(res.body.success.unverifiedUserLastName, "TESTUpdateLastName");

        done();
      });
  });

  it('Should DELETE the first restaurant from database DELETE', (done) => {
    chai.request(process.env.Test_URL)
      .delete('/unverifiedUser/' + testUnverifiedUser)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;

        done();
      });
  });
});