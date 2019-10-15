require("dotenv").config();
let chai = require("chai");
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

// REMOVE "SKIP" TO RUN THIS TEST. Run with -> mocha --g "Manually Test the authentication:"
describe.skip("Manually Test the authentication:", () => {
    var token = "";

    it("should Register a User - POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/register")
            .send({
                "userEmail": process.env.TEST_EMAIL,
                "userFirstName": "testFirstName",
                "userLastName": "testLastName",
                "userPassword": process.env.TEST_PASS
            })
            .end(function (err, res) {
                console.log(res.body)
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response should be json");
                assert.equal(res.body.success, true);

                done();
            });
    });
});