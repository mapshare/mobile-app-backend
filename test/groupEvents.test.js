require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /groupEvent route :', () => {
    var testUserId = 0;
    var testGroupId = 0;
    var testGroupId2 = 0;
    var testGroupEventId = 0;
    var testMarkId = 0;

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/users')
            .send({
                "userEmail": "groupTest@test123.com",
                "userFirstName": "Group Test First Name",
                "userLastName": "Group Test Last Name",
                "googleId": "423423424234"
            })
            .end(function (err, res) {
                testUserId = res.body._id;

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groupRoles')
            .send({
                "groupRoleName": "Admin",
                "groupRolePermisionLevel": 3
            })
            .end(function (err, res) {
                testGroupRoleId = res.body._id;

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groups')
            .send({
                "userId": testUserId,
                "groupName": "User Group Test Group",
                "groupRole": testGroupRoleId
            })
            .end(function (err, res) {
                testGroupId = res.body._id;

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groups')
            .send({
                "userId": testUserId,
                "groupName": "User Group Test Group 2",
                "groupRole": testGroupRoleId
            })
            .end(function (err, res) {
                testGroupId2 = res.body._id;

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post('/groups/' + testGroupId + '/mark')
            .send({
                markName: "TestMarkName",
                markLocations: {
                        locationAddress: "TestMarkAddress",
                        loactionPriceRange: 2,
                        additionalInformation: "TestInfo",
                        locationImageSet: [
                            {
                                locationImageData: "test",
                                locationImageContentType: "png"
                            }
                        ]
                    },
                geometry: { "coordinates": [0.7, 0.7] },
                groupMarkCreatedBy: testUserId
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                testMarkId = res.body.addedMark._id;
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
            .delete('/groups/' + testGroupId)
            .end(function (err, res) {
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/groups/' + testGroupId2)
            .end(function (err, res) {
                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupRoles/' + testGroupRoleId)
            .end(function (err, res) {
                done();
            });
    });


    it('should CREATE a GroupEvent to the database PUT', (done) => {
        chai.request(process.env.Test_URL)
            .post('/groups/' + testGroupId + '/event')
            .send({
                eventName: "testEventName",
                eventDescription: "testEventDescription",
                eventMembers: [testUserId],
                eventMark: testMarkId
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.addedEvent.eventName, "testEventName");
                assert.equal(res.body.addedEvent.eventDescription, "testEventDescription");
                assert.equal(res.body.addedEvent.eventMembers[0], testUserId);
                assert.equal(res.body.addedEvent.eventMark, testMarkId);

                testGroupEventId = res.body.groupEvents._id;

                done();
            });
    });


    it('Should READ ALL GroupEvent on /groupEvent GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupEvent')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    'groupEvents',
                    'group',
                    '__v');

                done();
            });
    });

    it('Should READ GroupEvent with the requested id on /groupEvent GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupEvent/' + testGroupEventId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.group, testGroupId);

                done();
            });
    });

    it('Should UPDATE GroupEvent on /groupEvent PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/groupEvent/' + testGroupEventId)
            .send({
                "group": testGroupId2,
                "groupEvents": [{
                    eventName: "testEventName1",
                    eventDescription: "testEventDescription1",
                    eventMembers: [testUserId],
                    eventMark: testMarkId
                }]
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.group, testGroupId2);
                assert.equal(res.body.success.groupEvents[0].eventName, "testEventName1");
                assert.equal(res.body.success.groupEvents[0].eventDescription, "testEventDescription1");
                assert.equal(res.body.success.groupEvents[0].eventMembers[0], testUserId);

                done();
            });
    });
    it('Should DELETE the groupEvent with the requested id on /groupEvent DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupEvent/' + testGroupEventId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });
});