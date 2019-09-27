require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /userEvent route :', () => {
    var testUserEventId = 0;
    var testUserId = 0

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/users')
            .send({
                "userEmail": "eventTest@test123.com",
                "userFirstName": "Event Test First Name",
                "userLastName": "Event Test Last Name",
                "googleId": "423423424234"
            })
            .end(function (err, res) {
                testUserId = res.body._id;

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/eventRoles')
            .send({
                "eventRoleName": "Admin",
                "eventRolePermisionLevel": 3
            })
            .end(function (err, res) {
                testEventRoleId = res.body._id;

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/eventRoles')
            .send({
                "eventRoleName": "Member",
                "eventRolePermisionLevel": 0
            })
            .end(function (err, res) {
                testEventRoleId2 = res.body._id;

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/events')
            .send({
                "userId": testUserId,
                "eventName": "User Event Test Event",
                "eventRole": testEventRoleId
            })
            .end(function (err, res) {
                testEventId = res.body._id;

                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/users/' + testUserId)
            .end(function (err, res) {
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/events/' + testEventId)
            .end(function (err, res) {
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/eventRoles/' + testEventRoleId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/eventRoles/' + testEventRoleId2)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });


    it('should CREATE a userEvent - POST', (done) => {
        chai.request(process.env.Test_URL)
            .post('/userEvent')
            .send({
                user: testUserId,
                event: testEventId,
                userEventRole: testEventRoleId2
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.user, testUserId);
                assert.equal(res.body.event, testEventId);
                assert.equal(res.body.userEventRole, testEventRoleId2);

                testUserEventId = res.body._id;
                done();
            });
    });

    it('Should READ ALL userEvent on /userEvent - GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/userEvent')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    "_id",
                    "user",
                    "userEventRole",
                    "__v");

                done();
            });
    });

    it('Should READ userEvent with the requested id on /userEvent GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/userEvent/' + testUserEventId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body._id, testUserEventId);

                done();
            });
    });

    it('Should UPDATE userEvent on /userEvent PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/userEvent/' + testUserEventId)
            .send({
                user: testUserId,
                event: testEventId,
                userEventRole: testEventRoleId
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.user, testUserId);
                assert.equal(res.body.success.event, testEventId);
                assert.equal(res.body.success.userEventRole, testEventRoleId);

                done();
            });
    });

    it('Should DELETE the userEvent from database DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/userEvent/' + testUserEventId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

});