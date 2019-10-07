require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /groupMark route :', () => {
    var testUserId = 0;
    var testGroupId = 0;
    var testGroupId2 = 0;
    var testGroupMarkId = 0;

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
                "groupName": "User Group Test Group",
                "groupRole": testGroupRoleId
            })
            .end(function (err, res) {
                testGroupId2 = res.body._id;

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


    it('should CREATE a GroupMark to the database PUT', (done) => {
        chai.request(process.env.Test_URL)
            .post('/groups/' + testGroupId + '/mark')
            .send({
                markName: "TestGroupMarkName",
                markLocations: {
                    locationAddress: "TestGroupMarkAddress",
                    loactionPriceRange: 2,
                    additionalInformation: "TestInfo",
                    locationImageSet: [
                        {
                            locationImageData: "test",
                            locationImageContentType: "png"
                        }
                    ]
                }
                ,
                geometry: { "coordinates": [0.5, 0.5] },
                groupMarkCreatedBy: testUserId
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.groupMarks.group, testGroupId);
                assert.equal(res.body.addedMark.markName, "TestGroupMarkName");
                assert.equal(res.body.addedMark.markLocations.locationAddress, "TestGroupMarkAddress");
                assert.equal(res.body.addedMark.markLocations.loactionPriceRange, 2);
                assert.equal(res.body.addedMark.markLocations.additionalInformation, "TestInfo");
                assert.equal(res.body.addedMark.markLocations.locationImageSet[0].locationImageContentType, "png");
                assert.equal(res.body.addedMark.geometry.coordinates[0], 0.5);
                assert.equal(res.body.addedMark.geometry.coordinates[1], 0.5);
                assert.equal(res.body.addedMark.groupMarkCreatedBy, testUserId);

                testGroupMarkId = res.body.groupMarks._id;

                done();
            });
    });


    it('Should READ ALL GroupMark on /groupMark GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupMark')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    'groupMarks',
                    'group',
                    '__v');

                done();
            });
    });

    it('Should READ GroupMark with the requested id on /groupMark GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupMark/' + testGroupMarkId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.group, testGroupId);

                done();
            });
    });

    it('Should UPDATE GroupMark on /groupMark PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/groupMark/' + testGroupMarkId)
            .send({
                "group": testGroupId,
                "groupMarks": [{
                    markName: "TestMarkName1",
                    markLocations: {
                        locationAddress: "TestMarkAddress1",
                        loactionPriceRange: 3,
                        additionalInformation: "TestInfo1",
                        locationImageSet: [
                            {
                                locationImageData: "test1",
                                locationImageContentType: "jpg"
                            }
                        ]
                    },
                    geometry: { "coordinates": [0.7, 0.7] },
                    groupMarkCreatedBy: testUserId
                }]
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                
                assert.equal(res.body.success.group, testGroupId);
                assert.equal(res.body.success.groupMarks[0].markName, "TestMarkName1");
                assert.equal(res.body.success.groupMarks[0].markLocations.locationAddress, "TestMarkAddress1");
                assert.equal(res.body.success.groupMarks[0].markLocations.loactionPriceRange, 3);
                assert.equal(res.body.success.groupMarks[0].markLocations.additionalInformation, "TestInfo1");
                assert.equal(res.body.success.groupMarks[0].markLocations.locationImageSet[0].locationImageContentType, "jpg");
                assert.equal(res.body.success.groupMarks[0].geometry.coordinates[0], 0.7);
                assert.equal(res.body.success.groupMarks[0].geometry.coordinates[1], 0.7);
                assert.equal(res.body.success.groupMarks[0].groupMarkCreatedBy, testUserId);

                done();
            });
    });

    it('Should DELETE the GroupMark with the requested id on /groupMark DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupMark/' + testGroupMarkId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });
});