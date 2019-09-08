require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /users route :', () => {
    var testUserId = 0;

    it('should CREATE a users POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/users')
            .send({
                "userEmail": "test@test.com",
                "userFirstName": "Test First Name",
                "userLastName": "Test Last Name",
                "googleId": "432432",
                "userPicture": "1231231"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");
                
                assert.equal(res.body.userEmail, "test@test.com");
                assert.equal(res.body.userFirstName, "Test First Name");
                assert.equal(res.body.userLastName, "Test Last Name");
                assert.equal(res.body.googleId, "432432");
                assert.equal(res.body.userPicture, "1231231");

                testUserId = res.body._id;
                done();
            });
    });

   
});