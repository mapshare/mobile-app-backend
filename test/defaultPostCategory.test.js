require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /defaultPostCategory route :', () => {
    var testDefaultPostCategoryId = 0;

    it('should CREATE a eventRole - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/defaultPostCategory')
            .send({
                defaultPostCategoryName: "TestName"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.defaultPostCategoryName, "TestName");

                testDefaultPostCategoryId = res.body._id;
                done();
            });
    });

    it('Should READ ALL defaultPostCategory on /defaultPostCategory - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultPostCategory')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    "defaultPostCategoryName",
                    '__v');

                done();
            });
    });

    it('Should READ group with the requested id on /defaultPostCategory GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultPostCategory/' + testDefaultPostCategoryId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testDefaultPostCategoryId);

                done();
            });
    });

    it('Should UPDATE eventRole on /defaultPostCategory PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/defaultPostCategory/' + testDefaultPostCategoryId)
            .send({
                defaultPostCategoryName: "TestName2",
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.defaultPostCategoryName, "TestName2");

                done();
            });
    });

    it('Should DELETE the defaultPostCategory from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/defaultPostCategory/' + testDefaultPostCategoryId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

});