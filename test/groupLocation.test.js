require('dotenv').config();
let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe('Test the /groupLocation route :', () => {
    var testUserId = 0;
    var testGroupId = 0;
    var testGroupId2 = 0;
    var testGroupLocationId = 0;

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


    it('should CREATE a GroupLocation to the database PUT', (done) => {
        chai.request(process.env.Test_URL)
            .post('/groupLocation')
            .send({
                "group": testGroupId,
                "groupLocations": [{
                    locationName: "TestLocationName",
                    locationAddress: "TestLocationAddress",
                    loactionPriceRange: 2,
                    additionalInformation: "TestInfo",
                    locationImageSet: [
                        {
                            LocationImageData: "test",
                            LocationImageContentType: "png"
                        }
                    ],
                    locationMark: [
                        { "geometry": { "coordinates": [0.5, 0.5] } }
                    ],
                    locationCreatedBy: testUserId
                }]
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.group, testGroupId);
                assert.equal(res.body.groupLocations[0].locationName, "TestLocationName");
                assert.equal(res.body.groupLocations[0].locationAddress, "TestLocationAddress");
                assert.equal(res.body.groupLocations[0].loactionPriceRange, 2);
                assert.equal(res.body.groupLocations[0].additionalInformation, "TestInfo");
                assert.equal(res.body.groupLocations[0].locationImageSet[0].LocationImageContentType, "png");
                assert.equal(res.body.groupLocations[0].locationMark[0].geometry.coordinates[0], 0.5);
                assert.equal(res.body.groupLocations[0].locationMark[0].geometry.coordinates[1], 0.5);
                assert.equal(res.body.groupLocations[0].locationCreatedBy, testUserId);

                testGroupLocationId = res.body._id;

                done();
            });
    });


    it('Should READ ALL GroupLocation on /groupLocation GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupLocation')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                expect(res.body[0]).to.have.all.keys(
                    '_id',
                    'groupLocations',
                    'group',
                    '__v');

                done();
            });
    });

    it('Should READ GroupLocation with the requested id on /groupLocation GET', (done) => {
        chai.request(process.env.Test_URL)
            .get('/groupLocation/' + testGroupLocationId)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json', "Response should be json");

                assert.equal(res.body.group, testGroupId);

                done();
            });
    });

    it('Should UPDATE GroupLocation on /groupLocation PUT', (done) => {
        chai.request(process.env.Test_URL)
            .put('/groupLocation/' + testGroupLocationId)
            .send({
                "group": testGroupId2,
                "groupLocations": [{
                    locationName: "TestLocationName1",
                    locationAddress: "TestLocationAddress1",
                    loactionPriceRange: 3,
                    additionalInformation: "TestInfo1",
                    locationImageSet: [
                        {
                            LocationImageData: "test",
                            LocationImageContentType: "jpg"
                        }
                    ],
                    locationMark: [
                        { "geometry": { "coordinates": [0.7, 0.7] } }
                    ],
                    locationCreatedBy: testUserId
                }]
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                
                assert.equal(res.body.success.group, testGroupId2);
                assert.equal(res.body.success.groupLocations[0].locationName, "TestLocationName1");
                assert.equal(res.body.success.groupLocations[0].locationAddress, "TestLocationAddress1");
                assert.equal(res.body.success.groupLocations[0].loactionPriceRange, 3);
                assert.equal(res.body.success.groupLocations[0].additionalInformation, "TestInfo1");
                assert.equal(res.body.success.groupLocations[0].locationImageSet[0].LocationImageContentType, "jpg");
                assert.equal(res.body.success.groupLocations[0].locationMark[0].geometry.coordinates[0], 0.7);
                assert.equal(res.body.success.groupLocations[0].locationMark[0].geometry.coordinates[1], 0.7);
                assert.equal(res.body.success.groupLocations[0].locationCreatedBy, testUserId);

                done();
            });
    });

    it('Should DELETE the GroupLocation with the requested id on /groupLocation DELETE', (done) => {
        chai.request(process.env.Test_URL)
            .delete('/groupLocation/' + testGroupLocationId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });
});