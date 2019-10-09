require("dotenv").config();
let chai = require("chai");
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe("Test the authentication:", () => {
    var token = "";

    it("should Register a User - POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/register")
            .send({
                "userEmail": "testEmail@TestEmail.com",
                "userFirstName": "TestName",
                "userLastName": "TestLastName",
                "userPassword": "myTestPassword"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response should be json");
                assert.equal(res.body.success, true);

                done();
            });
    });

    it("should Login a User - POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/login")
            .send({
                "userEmail": "testEmail@TestEmail.com",
                "userPassword": "myTestPassword"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "text/html", "Response should be html");
                token = res.header.authentication;
                done();
            });
    });

    it("Should GET user using JWT on /user - GET", (done) => {
        chai.request(process.env.Test_URL)
            .get("/user")
            .set("authentication", token)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response should be json");

                assert.equal(res.body.userEmail, "testEmail@TestEmail.com");
                assert.equal(res.body.userFirstName, "TestName");
                assert.equal(res.body.userLastName, "TestLastName");

                done();
            });
    });

    it("Should UPDATE User using JWT on /users - PUT", (done) => {
        chai.request(process.env.Test_URL)
            .put("/user")
            .set("authentication", token)
            .send({
                "userEmail": "test456@test456.com",
                "userFirstName": "New First Name",
                "userLastName": "New Last Name",
                "googleId": "45454544",
                "userImages": [{ "userImageData": "Image1", "userImageContentType": "jpg" }],
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.userEmail, "test456@test456.com");
                assert.equal(res.body.success.userFirstName, "New First Name");
                assert.equal(res.body.success.userLastName, "New Last Name");
                assert.equal(res.body.success.googleId, "45454544");
                assert.equal(res.body.success.userImages[0].userImageContentType, "jpg");

                done();
            });
    });

    it("Should DELETE the user using JWT on /users - DELETE", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/user")
            .set("authentication", token)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });
});