# Welcome
The documentation below outlines how to use the routes contained in this API.

 ## Links to each section
- [Groups](#Groups)
- [Group Roles](#Group-Roles)
- [Users](#Users)
- [Group Member](#Group-Member)
- [Group Events](#Group-Events)
- [Group Feed](#Group-Feed)
- [Group Marks](#Group-Marks)

# Groups
[Back to top](#Welcome)
## GET - "/groups"
    Gets all groups, returns a JSON array of all the groups.

## GET - /groups/:groupId
    Get group by id, returns a JSON Object of the selected group.

## POST - "/groups"
    Add group by sending a JSON object in the body.
    
    Http Request Body
    {
        "userId": testUserId,
        "groupRole": testGroupRoleId,
        "groupName": "Test Group"
    }

## PUT - "/groups/:groupId"
    Update group by id by sending a JSON object in the body.
    
    Http Request Body
    {
        "userId": testUserId,
        "groupRole": testGroupRoleId,
        "groupName": "Test Group"
    }
## DELETE - "/groups/:groupId"
    Delete group by sending the group id.

## POST - "/groups/:groupId/member"
    Add a group member to a group

    Http Request Body
    {
        "newGroupMember": userId,
        "groupRole": groupRoleId
    }

## POST - "/groups/:groupId/event/:eventId"
    Add a group member to a event

    Http Request Body
    {
        "newGroupMember": groupMemberId
    }

## POST - "/groups/:groupId/mark"
    Add a new mark to a group

    Http Request Body
    {
        markName: "",
        markLocations: {
            locationAddress: "",
            loactionPriceRange: 0,
            additionalInformation: "",
            locationImageSet: [
                {
                    locationImageData: "",
                    locationImageContentType: ""
                }
            ]
        },
        geometry: { "coordinates": [0, 0] },
        groupMarkCreatedBy: groupMemberId
    }

## POST - "/groups/:groupId/post"
    Add Group Post

    Http Request Body
    {
        "postTitle": "",
        "postContent": "",
        "postCreatedBy": groupMemberFId
    }

## POST - "/groups/:groupId/event"
    Add Group Event

    Http Request Body
    {
        eventName: "",
        eventDescription: "",
        eventMembers: [groupMemberId],
        eventMark: groupMarkId
    }

## POST - "/groups/:groupId/customCategory"
    Add custom mark category

    Http Request Body
    {
        "customMarkCategoryName": ""
    }

## POST - "/groups/:groupId/chat"
    Add Group Chat Room

    Http Request Body
    {
        "chatRoomName": "",
        "chatRoomMembers": [groupMemberId],
        "chatRoomCreatedBy": groupMemberId
    }

## POST - "/groups/:groupId/chat/:chatRoomId/:groupMemberId"
    Add Group Member to Chat Room


## POST - "/groups/:groupId/chat/:chatRoomId"
    Add Chat Message to chatRoom

    Http Request Body
    {
        "messageBody": "",
        "messageCreatedBy": groupMemberId
    }

## GET - "/groups/:groupId/mark/:markId"
    Get Group Mark, returns the Mark JSON Object.

## GET - "/groups/:groupId/post/:postId"
    Get Group Post, returns the Post JSON Object.

## GET - "/groups/:groupId/event/:eventId"
    Get Group Event, returns the Event JSON Object.

## GET - "/groups/:groupId/customCategory/:categoryId"
    Get custom mark category to event, returns the custom mark category JSON Object.

## GET - "/groups/:groupId/chat/:chatRoomId"
    Get Group Chat Room, returns the Chat Room JSON Object.

## PUT - "/groups/:groupId/mark/:markId"
    Update Group Mark

    Http Request Body
    {
        markName: "",
        markLocations: {
            locationAddress: "",
            loactionPriceRange: 0,
            additionalInformation: "",
            locationImageSet: [
                {
                    locationImageData: "",
                    locationImageContentType: ""
                }
            ]
        },
        geometry: { "coordinates": [0, 0] },
        groupMarkCreatedBy: groupMemberId
    }

## PUT - "/groups/:groupId/post/:postId"
    Update Group Post

    Http Request Body
    {       
        "postTitle": "",
        "postContent": "",
        "postCreatedBy": groupMemberFId
    }
## PUT - "/groups/:groupId/event/:eventId"
    Update Group Event

    Http Request Body
    {
        eventName: "",
        eventDescription: "",
        eventMembers: [groupMemberId],
        eventMark: groupMarkId
    }

## PUT - "/groups/:groupId/customCategory/:categoryId"
    Update Group custom mark category to event

    Http Request Body
    {
        "customMarkCategoryName": ""
    }

## PUT - "/groups/:groupId/chat/:chatRoomId"
    Update Group chat Room

    Http Request Body
    {
        "chatRoomName": "",
        "chatRoomMembers": [groupMemberId],
        "chatRoomCreatedBy": groupMemberId
    }

## PUT - "/groups/:groupId/chat/:chatRoomId/:chatMessageId"
    Update chat message

    Http Request Body
    {
        "messageBody": "",
        "messageCreatedBy": groupMemberId
    }

## DELETE - "/groups/:groupId/member/:id"
    Delete group member, returns { success: true }

## DELETE - "/groups/:groupId/event/:eventId/:memberId"
    Delete group member from event, returns the groupEvents JSON object.

## DELETE - "/groups/:groupId/customCategory/:id"
    delete custom mark category to event, returns the group JSON object.

## DELETE - "/groups/:groupId/mark/:id"
    delete group Mark, returns the groupMarks JSON object.

## DELETE - "/groups/:groupId/post/:id"
    delete Group Post, returns the groupFeed JSON object.

## DELETE - "/groups/:groupId/event/:id"
    delete Group Event, returns the groupEvents JSON object.

## DELETE - "/groups/:groupId"
    delete Group, returns the group JSON array.

## DELETE - "/groups/:groupId/chat/:chatRoomId"
    delete Group Chat Room, returns the groupChat JSON object.

## DELETE - "/groups/:groupId/chat/:chatRoomId/message/:chatMessageId"
    delete Chat Messages, returns the chatRoom JSON object as "groupChat" and the JSON array of messages for the chatRoom as "messages".

## DELETE - "/groups/:groupId/chat/:chatRoomId/:memberId"
    delete Group Member From Chat Room, returns the chatRoom JSON object.

# Group Roles
[Back to top](#Welcome)
## GET - "/groupRoles"
    Get all groupRoles, this will return a JSON array of groupRoles.

## GET - "/groupRoles/:id"
    Get groupRoles by id, this will return the JSON object of groupRoles.

## POST - "/groupRoles"
    Create a groupRoles by sending a JSON object in the body.
    {
        groupRoleName: "",
        groupRolePermisionLevel: 0
    }

## PUT - "/groupRoles/:id"
    Update groupRoles by its id, by sending a JSON object in the body.
    {
        groupRoleName: "",
        groupRolePermisionLevel: 0
    }

## DELETE - "/groupRoles/:id"
    Delete groupRoles by sending the groupRoles id, returns deleted groupRoles JSON object.





# Users
[Back to top](#Welcome)
> **WARNING**: ADMIN USE ONLY: SHOULD INTERACT WITH GROUP MEMBER THROUGH AUTH

## GET - "/users"
    Get all users, this will return a JSON array of users.

## GET - "/users/:id"
    Get user account information by id, this will return the JSON object for the user.

## POST - "/users"
    Create a user by sending a JSON object in the body.
    {
        "userEmail": "",
        "userFirstName": "",
        "userLastName": "",
        "userPassword": "",
        "googleId": "",
        "userImages": [{ "userImageData": "", "userImageContentType": "" }]
    }

## PUT - "/users/:id"
    Update user by its id, by sending a JSON object in the body.
    {
        "userEmail": "",
        "userFirstName": "",
        "userLastName": "",
        "userPassword": "",
        "googleId": "",
        "userImages": [{ "userImageData": "", "userImageContentType": "" }]
    }

## DELETE - "/users/:id"
    Delete user by sending the users id, returns deleted user JSON object.


# Group Member
[Back to top](#Welcome)
> **WARNING**: ADMIN USE ONLY: SHOULD INTERACT WITH GROUP MEMBER THROUGH GROUP

## GET - "/groupMember"
    Get all groupMember, this will return a JSON array of groupMember.

## GET - "/groupMember/:id"
    Get groupMember by id, this will return the JSON object of groupMember.

## POST - "/groupMember"
    Create a groupMember by sending a JSON object in the body.
    {
        user: userId,
        group: groupId,
        groupMemberRole: groupRoleId
    }

## PUT - "/groupMember/:id"
    Update groupMember by its id, by sending a JSON object in the body.
    {
        user: userId,
        group: groupId,
        groupMemberRole: groupRoleId
    }

## DELETE - "/groupMember/:id"
    Delete groupMember by sending the groupMember id, returns deleted groupMember JSON object.



# Group Events
[Back to top](#Welcome)
> **WARNING**: ADMIN USE ONLY: SHOULD INTERACT WITH GROUP EVENTS THROUGH GROUP

## GET - "/groupEvent"
    Get all groupEvent, this will return a JSON array of groupEvent.

## GET - "/groupEvent/:id"
    Get groupEvent by id, this will return the JSON object of groupEvent.

## POST - "/groupEvent"
    Create a groupEvent by sending a JSON object in the body.
    {
        eventName: "",
        eventDescription: "",
        eventMembers: [groupMemberID],
        eventMark: markId
    }

## PUT - "/groupEvent/:id"
    Update groupEvent by its id, by sending a JSON object in the body.
    {
        eventName: "",
        eventDescription: "",
        eventMembers: [groupMemberID],
        eventMark: markId
    }

## DELETE - "/groupEvent/:id"
    Delete groupEvent by sending the groupEvent id, returns deleted groupEvent JSON object.


# Group Feed
[Back to top](#Welcome)
> **WARNING**: ADMIN USE ONLY: SHOULD INTERACT WITH GROUP FEED THROUGH GROUP

## GET - "/groupFeed"
    Get all groupFeed, this will return a JSON array of groupFeed.

## GET - "/groupFeed/:id"
    Get groupFeed by id, this will return the JSON object of groupFeed.

## POST - "/groupFeed"
    Create a groupFeed by sending a JSON object in the body.
    {
        "group": groupId,
        "groupPosts": [{
            "postTitle": "",
            "postContent": "",
            "postCreatedBy": memberId
        }]
    }

## PUT - "/groupFeed/:id"
    Update groupFeed by its id, by sending a JSON object in the body.
    {
        eventName: "",
        eventDescription: "",
        eventMembers: [groupMemberID],
        eventMark: markId
    }

## DELETE - "/groupFeed/:id"
    Delete groupFeed by sending the groupFeed id, returns deleted groupFeed JSON object.


# Group Marks
[Back to top](#Welcome)
> **WARNING**: ADMIN USE ONLY: SHOULD INTERACT WITH GROUP MARKS THROUGH GROUP

## GET - "/groupMark"
    Get all groupMark, this will return a JSON array of groupMark.

## GET - "/groupMark/:id"
    Get groupMark by id, this will return the JSON object of groupMark.

## POST - "/groupMark"
    Create a groupMark by sending a JSON object in the body.
    {
        markName: "",
        markLocations: {
            locationAddress: "",
            loactionPriceRange: 0,
            additionalInformation: "",
            locationImageSet: [
                {
                    locationImageData: "",
                    locationImageContentType: ""
                }
            ]
        },
        geometry: { "coordinates": [0, 0] },
        groupMarkCreatedBy: groupMemberId
    }

## PUT - "/groupMark/:id"
    Update groupMark by its id, by sending a JSON object in the body.
    {
        markName: "",
        markLocations: {
            locationAddress: "",
            loactionPriceRange: 0,
            additionalInformation: "",
            locationImageSet: [
                {
                    locationImageData: "",
                    locationImageContentType: ""
                }
            ]
        },
        geometry: { "coordinates": [0, 0] },
        groupMarkCreatedBy: groupMemberId
    }

## DELETE - "/groupMark/:id"
    Delete groupMark by sending the groupMark id, returns deleted groupMark JSON object.
