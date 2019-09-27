require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /defaultCategory route :', () => {
    var testDefaultCategoryId = 0;

    it('should CREATE a eventRole - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/defaultCategory')
            .send({
                defaultCategoryName: "TestName"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.defaultCategoryName, "TestName");

                testDefaultCategoryId = res.body._id;
                done();
            });
    });

    it('Should READ ALL defaultCategory on /defaultCategory - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultCategory')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    "defaultCategoryName",
                    '__v');

                done();
            });
    });

    it('Should READ group with the requested id on /defaultCategory GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultCategory/' + testDefaultCategoryId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testDefaultCategoryId);

                done();
            });
    });

    it('Should UPDATE eventRole on /defaultCategory PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/defaultCategory/' + testDefaultCategoryId)
            .send({
                defaultCategoryName: "TestName2",
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.defaultCategoryName, "TestName2");

                done();
            });
    });

    it('Should DELETE the defaultCategory from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/defaultCategory/' + testDefaultCategoryId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

});