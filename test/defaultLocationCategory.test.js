require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /defaultLocationCategory route :', () => {
    var testDefaultLocationCategoryId = 0;

    it('should CREATE a eventRole - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/defaultLocationCategory')
            .send({
                defaultLocationCategoryName: "TestName"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.defaultLocationCategoryName, "TestName");

                testDefaultLocationCategoryId = res.body._id;
                done();
            });
    });

    it('Should READ ALL defaultLocationCategory on /defaultLocationCategory - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultLocationCategory')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    "defaultLocationCategoryName",
                    '__v');

                done();
            });
    });

    it('Should READ group with the requested id on /defaultLocationCategory GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultLocationCategory/' + testDefaultLocationCategoryId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testDefaultLocationCategoryId);

                done();
            });
    });

    it('Should UPDATE eventRole on /defaultLocationCategory PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/defaultLocationCategory/' + testDefaultLocationCategoryId)
            .send({
                defaultLocationCategoryName: "TestName2",
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.defaultLocationCategoryName, "TestName2");

                done();
            });
    });

    it('Should DELETE the defaultLocationCategory from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/defaultLocationCategory/' + testDefaultLocationCategoryId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

});