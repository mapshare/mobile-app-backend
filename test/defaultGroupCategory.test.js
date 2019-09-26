require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /defaultGroupCategory route :', () => {
    var testDefaultGroupCategoryId = 0;

    it('should CREATE a eventRole - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/defaultGroupCategory')
            .send({
                defaultGroupCategoryName: "TestName"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.defaultGroupCategoryName, "TestName");

                testDefaultGroupCategoryId = res.body._id;
                done();
            });
    });

    it('Should READ ALL defaultGroupCategory on /defaultGroupCategory - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultGroupCategory')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    "defaultGroupCategoryName",
                    '__v');

                done();
            });
    });

    it('Should READ group with the requested id on /defaultGroupCategory GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/defaultGroupCategory/' + testDefaultGroupCategoryId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testDefaultGroupCategoryId);

                done();
            });
    });

    it('Should UPDATE eventRole on /defaultGroupCategory PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/defaultGroupCategory/' + testDefaultGroupCategoryId)
            .send({
                defaultGroupCategoryName: "TestName2",
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.defaultGroupCategoryName, "TestName2");

                done();
            });
    });

    it('Should DELETE the defaultGroupCategory from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/defaultGroupCategory/' + testDefaultGroupCategoryId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

});