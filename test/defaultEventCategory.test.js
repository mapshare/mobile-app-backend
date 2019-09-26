require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /defaultEventCategory route :', () => {
    var testDefaultEventCategoryId = 0;

    it('should CREATE a eventRole - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/defaultEventCategory')
            .send({
                defaultEventCategoryName: "TestName"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.defaultEventCategoryName, "TestName");

                testDefaultEventCategoryId = res.body._id;
                done();
            });
    });

    it('Should READ ALL defaultEventCategory on /defaultEventCategory - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultEventCategory')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    "defaultEventCategoryName",
                    '__v');

                done();
            });
    });

    it('Should READ group with the requested id on /defaultEventCategory GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultEventCategory/' + testDefaultEventCategoryId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testDefaultEventCategoryId);

                done();
            });
    });

    it('Should UPDATE eventRole on /defaultEventCategory PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/defaultEventCategory/' + testDefaultEventCategoryId)
            .send({
                defaultEventCategoryName: "TestName2",
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.defaultEventCategoryName, "TestName2");

                done();
            });
    });

    it('Should DELETE the defaultEventCategory from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/defaultEventCategory/' + testDefaultEventCategoryId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

});