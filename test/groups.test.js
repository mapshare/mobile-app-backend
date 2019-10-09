require("dotenv").config();
let chai = require("chai");
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
let expect = chai.expect;
let assert = chai.assert;

describe("Test the /Groups route :", () => {
    var testGroupId = 0;
    var testUserId = 0;
    var testUsertoken1 = "";
    var testUserId2 = 0;
    var testUsertoken3 = "";
    var testUserId3 = 0;
    var testUsertoken2 = "";
    var testGroupRoleId = 0;
    var testGroupRoleId2 = 0;
    var testGroupMemberId = 0;
    var testGroupMarkId = 0;
    var testGroupEventId = 0;
    var testGroupMember2Id = 0;
    var testGroupMember3Id = 0;
    var testTestCustomMarkCategory = 0;
    var testPostId = 0;
    var testChatRoomId = 0;
    var testgroupChatId = 0;
    var testMessageId = 0;

    before((done) => {
        chai.request(process.env.Test_URL)
            .post("/register")
            .send({
                "userEmail": "groupTest@test123.com",
                "userFirstName": "Group Test First Name",
                "userLastName": "Group Test Last Name",
                "userPassword": "myTestPassword1"
            })
            .end(function (err, res) {

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post("/login")
            .send({
                "userEmail": "groupTest@test123.com",
                "userPassword": "myTestPassword1"
            })
            .end(function (err, res) {
                testUsertoken1 = res.header.authentication;
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .get("/user")
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                testUserId = res.body._id;
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post("/register")
            .send({
                "userEmail": "groupTest2@test123.com",
                "userFirstName": "Group Test First Name2",
                "userLastName": "Group Test Last Name2",
                "userPassword": "myTestPassword2"
            })
            .end(function (err, res) {

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post("/login")
            .send({
                "userEmail": "groupTest2@test123.com",
                "userPassword": "myTestPassword2"
            })
            .end(function (err, res) {
                testUsertoken2 = res.header.authentication;
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .get("/user")
            .set("authentication", testUsertoken2)
            .end(function (err, res) {
                testUserId2 = res.body._id;
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post("/register")
            .send({
                "userEmail": "groupTest3@test123.com",
                "userFirstName": "Group Test First Name3",
                "userLastName": "Group Test Last Name3",
                "userPassword": "myTestPassword3"
            })
            .end(function (err, res) {

                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .post("/login")
            .send({
                "userEmail": "groupTest3@test123.com",
                "userPassword": "myTestPassword3"
            })
            .end(function (err, res) {
                testUsertoken3 = res.header.authentication;
                done();
            });
    });

    before((done) => {
        chai.request(process.env.Test_URL)
            .get("/user")
            .set("authentication", testUsertoken3)
            .end(function (err, res) {
                testUserId3 = res.body._id;
                done();
            });
    });


    before((done) => {
        chai.request(process.env.Test_URL)
            .post("/groupRoles")
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
            .post("/groupRoles")
            .send({
                "groupRoleName": "Member",
                "groupRolePermisionLevel": 0
            })
            .end(function (err, res) {
                testGroupRoleId2 = res.body._id;

                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete("/groupRoles/" + testGroupRoleId)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete("/groupRoles/" + testGroupRoleId2)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });


    after((done) => {
        chai.request(process.env.Test_URL)
            .delete("/user")
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete("/user")
            .set("authentication", testUsertoken2)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

    after((done) => {
        chai.request(process.env.Test_URL)
            .delete("/user")
            .set("authentication", testUsertoken3)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });

    it("should CREATE a Group POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups")
            .set("authentication", testUsertoken1)
            .send({
                "groupName": "Test Group"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response should be json");

                assert.equal(res.body.groupName, "Test Group");

                testGroupId = res.body._id;
                testGroupMemberId = res.body.groupMembers[0];

                done();
            });
    });


    it("Should READ ALL Groups on /groups GET", (done) => {
        chai.request(process.env.Test_URL)
            .get("/groups")
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body[0]).to.have.all.keys(
                    "_id",
                    "groupChat",
                    "groupDefaultCategory",
                    "groupCustomMarkCategory",
                    "groupMembers",
                    "groupEvents",
                    "groupFeed",
                    "groupMarks",
                    "groupName",
                    "__v");


                done();
            });
    });

    it("Should READ Group with the requested id on /groups GET", (done) => {
        chai.request(process.env.Test_URL)
            .get("/groups/" + testGroupId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json", "Response should be json");
                assert.equal(res.body.groupName, "Test Group");

                done();
            });
    });

    it("Should UPDATE Group on /groups PUT", (done) => {
        chai.request(process.env.Test_URL)
            .put("/groups/" + testGroupId)
            .set("authentication", testUsertoken1)
            .send({
                "groupName": "New Test Group Name",
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success.groupName, "New Test Group Name");

                done();
            });
    });

    it("Should Add a Group member on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/member")
            .set("authentication", testUsertoken1)
            .send({
                "newGroupMember": testUserId2,
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.user, testUserId2);
                assert.equal(res.body.group, testGroupId);

                testGroupMemberId = res.body._id;

                done();
            });
    });

    it("Should Add another Group member on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/member")
            .set("authentication", testUsertoken1)
            .send({
                "newGroupMember": testUserId3,
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.user, testUserId3);
                assert.equal(res.body.group, testGroupId);

                testGroupMember2Id = res.body._id;

                done();
            });
    });

    it("Should Add a Mark on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/mark")
            .set("authentication", testUsertoken1)
            .send({
                markName: "Test Add Mark Thru group",
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
                geometry: { "coordinates": [0.6, 0.6] },
                groupMarkCreatedBy: testGroupMemberId
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupMarks.group, testGroupId);
                assert.equal(res.body.addedMark.markName, "Test Add Mark Thru group");
                assert.equal(res.body.addedMark.markLocations.locationAddress, "TestMarkAddress");
                assert.equal(res.body.addedMark.markLocations.loactionPriceRange, 2);
                assert.equal(res.body.addedMark.markLocations.additionalInformation, "TestInfo");
                assert.equal(res.body.addedMark.markLocations.locationImageSet[0].locationImageContentType, "png");
                assert.equal(res.body.addedMark.geometry.coordinates[0], 0.6);
                assert.equal(res.body.addedMark.geometry.coordinates[1], 0.6);
                assert.equal(res.body.addedMark.groupMarkCreatedBy, testGroupMemberId);

                testGroupMarkId = res.body.addedMark._id;

                done();
            });
    });

    it("Should Add a Event on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/event")
            .set("authentication", testUsertoken1)
            .send({
                eventName: "testGroupEventName",
                eventDescription: "testGroupEventDescription",
                eventMembers: [testGroupMemberId],
                eventMark: testGroupMarkId
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupEvents.group, testGroupId);
                assert.equal(res.body.addedEvent.eventName, "testGroupEventName");
                assert.equal(res.body.addedEvent.eventDescription, "testGroupEventDescription");
                assert.equal(res.body.addedEvent.eventMembers[0], testGroupMemberId);
                assert.equal(res.body.addedEvent.eventMark, testGroupMarkId);

                testGroupEventId = res.body.addedEvent._id;

                done();
            });
    });

    it("Should Add a Group member to event on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/event/" + testGroupEventId)
            .set("authentication", testUsertoken1)
            .send({
                "newGroupMember": testGroupMember2Id
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.group, testGroupId);
                assert.equal(res.body.groupEvents[0].eventName, "testGroupEventName");
                assert.equal(res.body.groupEvents[0].eventDescription, "testGroupEventDescription");
                assert.equal(res.body.groupEvents[0].eventMembers[0], testGroupMemberId);
                assert.equal(res.body.groupEvents[0].eventMembers[1], testGroupMember2Id);
                assert.equal(res.body.groupEvents[0].eventMark, testGroupMarkId);

                done();
            });
    });

    it("Should Add a group custom mark category on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/customCategory")
            .set("authentication", testUsertoken1)
            .send({
                "customMarkCategoryName": "TestCustomMarkCategory"
            })
            .end(function (err, res) {

                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body._id, testGroupId);
                assert.equal(res.body.groupCustomMarkCategory[0].customMarkCategoryName, "TestCustomMarkCategory");

                testTestCustomMarkCategory = res.body.groupCustomMarkCategory[0]._id;
                done();
            });
    });

    it("Should Add a group post on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/post")
            .set("authentication", testUsertoken1)
            .send({
                "postTitle": "TestGroupPostTitle",
                "postContent": "TestGroupPostContent",
                "postCreatedBy": testGroupMemberId
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupPosts.group, testGroupId);
                assert.equal(res.body.addedPost.postTitle, "TestGroupPostTitle");
                assert.equal(res.body.addedPost.postContent, "TestGroupPostContent");
                assert.equal(res.body.addedPost.postCreatedBy, testGroupMemberId);

                testPostId = res.body.addedPost._id;

                done();
            });
    });

    it("Should Add a group ChatRoom on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/chat")
            .set("authentication", testUsertoken1)
            .send({
                "chatRoomName": "TestGroupChatName",
                "chatRoomMembers": [testGroupMemberId],
                "chatRoomCreatedBy": testGroupMemberId
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupChat.group, testGroupId);
                assert.equal(res.body.addedChatRoom.chatRoomName, "TestGroupChatName");
                assert.equal(res.body.addedChatRoom.chatRoomMembers[0], testGroupMemberId);
                assert.equal(res.body.addedChatRoom.chatRoomCreatedBy, testGroupMemberId);

                testgroupChatId = res.body.groupChat._id;
                testChatRoomId = res.body.addedChatRoom._id;

                done();
            });
    });

    it("Should Add a group member to ChatRoom on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/chat/" + testChatRoomId + "/" + testGroupMember2Id)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupMember._id, testGroupMember2Id);
                assert.equal(res.body.groupChat.chatRoomName, "TestGroupChatName");
                assert.equal(res.body.groupChat.chatRoomMembers[1], testGroupMember2Id);
                assert.equal(res.body.groupChat.chatRoomCreatedBy, testGroupMemberId);

                done();
            });
    });

    it("Should Add a message to ChatRoom on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .post("/groups/" + testGroupId + "/chat/" + testChatRoomId)
            .set("authentication", testUsertoken1)
            .send({
                "messageBody": "TestGroupChatMessage",
                "messageCreatedBy": testGroupMemberId
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body[0].messageBody, "TestGroupChatMessage");
                assert.equal(res.body[0].messageCreatedBy, testGroupMemberId);

                testMessageId = res.body[0]._id;

                done();
            });
    });

    it("Should GET a Mark on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .get("/groups/" + testGroupId + "/mark/" + testGroupMarkId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupMarks.group, testGroupId);
                assert.equal(res.body.mark._id, testGroupMarkId);
                assert.equal(res.body.mark.markName, "Test Add Mark Thru group");
                assert.equal(res.body.mark.markLocations.locationAddress, "TestMarkAddress");
                assert.equal(res.body.mark.markLocations.loactionPriceRange, 2);
                assert.equal(res.body.mark.markLocations.additionalInformation, "TestInfo");
                assert.equal(res.body.mark.markLocations.locationImageSet[0].locationImageContentType, "png");
                assert.equal(res.body.mark.geometry.coordinates[0], 0.6);
                assert.equal(res.body.mark.geometry.coordinates[1], 0.6);
                assert.equal(res.body.mark.groupMarkCreatedBy, testGroupMemberId);

                done();
            });
    });
    it("Should GET a Event on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .get("/groups/" + testGroupId + "/event/" + testGroupEventId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupEvents.group, testGroupId);
                assert.equal(res.body.event._id, testGroupEventId);
                assert.equal(res.body.event.eventName, "testGroupEventName");
                assert.equal(res.body.event.eventDescription, "testGroupEventDescription");
                assert.equal(res.body.event.eventMembers[0], testGroupMemberId);
                assert.equal(res.body.event.eventMark, testGroupMarkId);

                done();
            });
    });

    it("Should GET a group custom mark category on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .get("/groups/" + testGroupId + "/customCategory/" + testTestCustomMarkCategory)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {

                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.group._id, testGroupId);
                assert.equal(res.body.category._id, testTestCustomMarkCategory);
                assert.equal(res.body.category.customMarkCategoryName, "TestCustomMarkCategory");

                done();
            });
    });

    it("Should GET a group post on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .get("/groups/" + testGroupId + "/post/" + testPostId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupPosts.group, testGroupId);
                assert.equal(res.body.post._id, testPostId);
                assert.equal(res.body.post.postTitle, "TestGroupPostTitle");
                assert.equal(res.body.post.postContent, "TestGroupPostContent");
                assert.equal(res.body.post.postCreatedBy, testGroupMemberId);

                done();
            });
    });

    it("Should GET a ChatRoom on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .get("/groups/" + testGroupId + "/chat/" + testChatRoomId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.chatRoomMembers).to.be.a("array");
                expect(res.body.chatRoomMessage).to.be.a("array");

                assert.equal(res.body._id, testChatRoomId);
                assert.equal(res.body.chatRoomName, "TestGroupChatName");
                assert.equal(res.body.chatRoomCreatedBy, testGroupMemberId);

                done();
            });
    });

    it("Should UPDATE a Mark on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .put("/groups/" + testGroupId + "/mark/" + testGroupMarkId)
            .set("authentication", testUsertoken1)
            .send({
                markName: "Test UPDATE Mark Thru group",
                markLocations: {
                    locationAddress: "TestUPDATEMarkAddress",
                    loactionPriceRange: 3,
                    additionalInformation: "TestUPDATEInfo",
                    locationImageSet: [
                        {
                            locationImageData: "test",
                            locationImageContentType: "png"
                        }
                    ]
                },
                geometry: { "coordinates": [0.3, 0.3] }
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupMarks.group, testGroupId);
                assert.equal(res.body.updatedMark._id, testGroupMarkId);
                assert.equal(res.body.updatedMark.markName, "Test UPDATE Mark Thru group");
                assert.equal(res.body.updatedMark.markLocations.locationAddress, "TestUPDATEMarkAddress");
                assert.equal(res.body.updatedMark.markLocations.loactionPriceRange, 3);
                assert.equal(res.body.updatedMark.markLocations.additionalInformation, "TestUPDATEInfo");
                assert.equal(res.body.updatedMark.markLocations.locationImageSet[0].locationImageContentType, "png");
                assert.equal(res.body.updatedMark.geometry.coordinates[0], 0.3);
                assert.equal(res.body.updatedMark.geometry.coordinates[1], 0.3);
                assert.equal(res.body.updatedMark.groupMarkCreatedBy, testGroupMemberId);

                done();
            });
    });
    it("Should UPDATE a Event on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .put("/groups/" + testGroupId + "/event/" + testGroupEventId)
            .set("authentication", testUsertoken1)
            .send({
                eventName: "testUPDATEGroupEventName",
                eventDescription: "testUPDATEGroupEventDescription"
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupEvents.group, testGroupId);
                assert.equal(res.body.updatedEvent._id, testGroupEventId);
                assert.equal(res.body.updatedEvent.eventName, "testUPDATEGroupEventName");
                assert.equal(res.body.updatedEvent.eventDescription, "testUPDATEGroupEventDescription");
                assert.equal(res.body.updatedEvent.eventMembers[0], testGroupMemberId);
                assert.equal(res.body.updatedEvent.eventMark, testGroupMarkId);

                done();
            });
    });

    it("Should UPDATE a group custom mark category on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .put("/groups/" + testGroupId + "/customCategory/" + testTestCustomMarkCategory)
            .set("authentication", testUsertoken1)
            .send({
                "customMarkCategoryName": "TestUPDATECustomMarkCategory"
            })
            .end(function (err, res) {

                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.group._id, testGroupId);
                assert.equal(res.body.updatedCategory._id, testTestCustomMarkCategory);
                assert.equal(res.body.updatedCategory.customMarkCategoryName, "TestUPDATECustomMarkCategory");

                done();
            });
    });

    it("Should UPDATE a group post on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .put("/groups/" + testGroupId + "/post/" + testPostId)
            .set("authentication", testUsertoken1)
            .send({
                "postTitle": "TestUPDATEGroupPostTitle",
                "postContent": "TestUPDATEGroupPostContent"
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupPosts.group, testGroupId);
                assert.equal(res.body.updatedPost._id, testPostId);
                assert.equal(res.body.updatedPost.postTitle, "TestUPDATEGroupPostTitle");
                assert.equal(res.body.updatedPost.postContent, "TestUPDATEGroupPostContent");
                assert.equal(res.body.updatedPost.postCreatedBy, testGroupMemberId);

                done();
            });
    });

    it("Should UPDATE a group ChatRoom on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .put("/groups/" + testGroupId + "/chat/" + testChatRoomId)
            .set("authentication", testUsertoken1)
            .send({
                "chatRoomName": "TestUpdateGroupChatName",
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupChat.group, testGroupId);
                assert.equal(res.body.updatedChatRoom._id, testChatRoomId);
                assert.equal(res.body.updatedChatRoom.chatRoomName, "TestUpdateGroupChatName");
                assert.equal(res.body.updatedChatRoom.chatRoomMembers[0], testGroupMemberId);
                assert.equal(res.body.updatedChatRoom.chatRoomCreatedBy, testGroupMemberId);

                done();
            });
    });

    it("Should UPDATE a message in a ChatRoom on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .put("/groups/" + testGroupId + "/chat/" + testChatRoomId + "/" + testMessageId)
            .set("authentication", testUsertoken1)
            .send({
                "messageBody": "TestUpdateGroupChatMessage"
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body._id, testMessageId);
                assert.equal(res.body.messageBody, "TestUpdateGroupChatMessage");
                assert.equal(res.body.messageCreatedBy, testGroupMemberId);

                done();
            });
    });

    it("Should DELETE a message in a ChatRoom on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId + "/chat/" + testChatRoomId + "/message/" + testMessageId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.groupChat._id, testChatRoomId);
                assert.deepEqual(res.body.messages, []);

                done();
            });
    });

    it("Should DELETE a member from the ChatRoom on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId + "/chat/" + testChatRoomId + "/" + testGroupMember2Id)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body._id, testChatRoomId);
                assert.equal(res.body.chatRoomMembers.length, 1);
                assert.equal(res.body.chatRoomName, "TestUpdateGroupChatName");

                done();
            });
    });

    it("Should DELETE a group ChatRoom on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId + "/chat/" + testChatRoomId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body._id, testgroupChatId);
                assert.equal(res.body.group, testGroupId);
                assert.deepEqual(res.body.groupChatRooms, []);

                done();
            });
    });

    it("Should DELETE a Group member from event on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId + "/event/" + testGroupEventId + "/" + testGroupMember2Id)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.group, testGroupId);
                assert.equal(res.body.groupEvents[0].eventName, "testUPDATEGroupEventName");
                assert.equal(res.body.groupEvents[0].eventDescription, "testUPDATEGroupEventDescription");
                assert.equal(res.body.groupEvents[0].eventMembers[0], testGroupMemberId);
                assert.equal(res.body.groupEvents[0].eventMembers.length, 1);
                assert.equal(res.body.groupEvents[0].eventMark, testGroupMarkId);

                done();
            });
    });

    it("Should DELETE the group custom mark category from database DELETE", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId + "/customCategory/" + testTestCustomMarkCategory)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body._id, testGroupId);
                assert.deepEqual(res.body.groupCustomMarkCategory, []);

                done();
            });
    });

    it("Should DELETE the group mark from database DELETE", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId + "/mark/" + testGroupMarkId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.deepEqual(res.body.group, testGroupId);
                assert.deepEqual(res.body.groupMarks, []);


                done();
            });
    });

    it("Should DELETE the group Event from database DELETE", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId + "/event/" + testGroupEventId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.deepEqual(res.body.group, testGroupId);
                assert.deepEqual(res.body.groupEvents, []);

                done();
            });
    });

    it("Should DELETE the group post from database DELETE", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId + "/post/" + testPostId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.deepEqual(res.body.group, testGroupId);
                assert.deepEqual(res.body.groupPosts, []);

                done();
            });
    });

    it("Should DELETE a Second Group member on /groups POST", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId + "/member/" + testGroupMember2Id)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                assert.equal(res.body.success, true);

                done();
            });
    });

    it("Should DELETE the group from database DELETE", (done) => {
        chai.request(process.env.Test_URL)
            .delete("/groups/" + testGroupId)
            .set("authentication", testUsertoken1)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                done();
            });
    });
});