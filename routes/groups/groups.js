const express = require("express");
const router = express.Router();
const dataService = require("./groupsService");
const data = dataService();

// get list of groups
router.get('/groups', (req, res, next) => {
    data.getGroups().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'error': err })
    })
});

// add group
router.post('/groups', (req, res, next) => {
    data.addGroup(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// list members of group
router.get('/groups/:groupId', (req, res, next) => {
    data.getGroup(req.params.groupId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// update Group in db
router.put('/groups/:id', (req, res, next) => {
    data.updateGroupById(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })

});

// add Group member
router.post('/groups/:id/member', (req, res, next) => {
    data.addGroupMember(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })

});


// add Group Member to Event
router.post('/groups/:groupId/event/:eventId', (req, res, next) => {
    data.addGroupMemberToEvent(req.params.groupId, req.params.eventId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});


// add Group Mark
router.post('/groups/:id/mark', (req, res, next) => {
    data.addGroupMark(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// add Group Post
router.post('/groups/:id/post', (req, res, next) => {
    data.addGroupPost(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// add Group Event
router.post('/groups/:id/event', (req, res, next) => {
    data.addGroupEvent(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// add custom mark category
router.post('/groups/:groupId/customCategory', (req, res, next) => {
    data.addCustomCategoryMark(req.params.groupId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// add Group Chat Room
router.post('/groups/:groupId/chat', (req, res, next) => {
    data.addChatRoom(req.params.groupId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// add Group Member to Chat Room
router.post('/groups/:groupId/chat/:chatRoomId/:groupMemberId', (req, res, next) => {
    data.addGroupMemberToChatRoom(req.params.groupId, req.params.chatRoomId, req.params.groupMemberId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// add Chat Message to chatRoom
router.post('/groups/:groupId/chat/:chatRoomId', (req, res, next) => {
    data.addChatMessage(req.params.groupId, req.params.chatRoomId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// get Group Mark
router.get('/groups/:id/mark/:markId', (req, res, next) => {
    data.getGroupMark(req.params.id, req.params.markId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// get Group Post
router.get('/groups/:id/post/:postId', (req, res, next) => {
    data.getGroupPost(req.params.id, req.params.postId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// get Group Event
router.get('/groups/:id/event/:eventId', (req, res, next) => {
    data.getGroupEvent(req.params.id, req.params.eventId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// get custom mark category to event
router.get('/groups/:groupId/customCategory/:categoryId', (req, res, next) => {
    data.getCustomCategoryMark(req.params.groupId, req.params.categoryId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// get Group Chat Room
router.get('/groups/:groupId/chat/:chatRoomId', (req, res, next) => {
    data.getChatRoom(req.params.groupId, req.params.chatRoomId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// update Group Mark
router.put('/groups/:id/mark/:markId', (req, res, next) => {
    data.updateGroupMark(req.params.id, req.params.markId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// update Group Post
router.put('/groups/:id/post/:postId', (req, res, next) => {
    data.updateGroupPost(req.params.id, req.params.postId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// update Group Event
router.put('/groups/:id/event/:eventId', (req, res, next) => {
    data.updateGroupEvent(req.params.id, req.params.eventId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// update custom mark category to event
router.put('/groups/:groupId/customCategory/:categoryId', (req, res, next) => {
    data.updateCustomCategoryMark(req.params.groupId, req.params.categoryId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// update Group Chat Room
router.put('/groups/:groupId/chat/:chatRoomId', (req, res, next) => {
    data.updateChatRoom(req.params.groupId, req.params.chatRoomId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// update Chat Messages
router.put('/groups/:groupId/chat/:chatRoomId/:chatMessageId', (req, res, next) => {
    data.updateChatMessage(req.params.groupId, req.params.chatRoomId, req.params.chatMessageId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// delete Group member
router.delete('/groups/:groupId/member/:id', (req, res, next) => {
    data.deleteGroupMember(req.params.groupId, req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// delete Group Member from Event
router.delete('/groups/:groupId/event/:eventId/:memberId', (req, res, next) => {
    data.deleteGroupMemberFromEvent(req.params.groupId, req.params.eventId, req.params.memberId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// delete custom mark category to event
router.delete('/groups/:groupId/customCategory/:id', (req, res, next) => {
    data.deleteCustomCategoryMark(req.params.groupId, req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});


// delete Group Mark
router.delete('/groups/:groupId/mark/:id', (req, res, next) => {
    data.deleteGroupMark(req.params.groupId, req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// delete Group Post
router.delete('/groups/:groupId/post/:id', (req, res, next) => {
    data.deleteGroupPost(req.params.groupId, req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// delete Group Event
router.delete('/groups/:groupId/event/:id', (req, res, next) => {
    data.deleteGroupEvent(req.params.groupId, req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});
// delete Group in db
router.delete('/groups/:id', (req, res, next) => {
    data.deleteGroupById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// delete Group Chat Room
router.delete('/groups/:groupId/chat/:chatRoomId', (req, res, next) => {
    data.deleteChatRoom(req.params.groupId, req.params.chatRoomId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// delete Chat Messages
router.delete('/groups/:groupId/chat/:chatRoomId/message/:chatMessageId', (req, res, next) => {
    data.deleteChatMessage(req.params.groupId, req.params.chatRoomId, req.params.chatMessageId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// delete Group Member From Chat Room
router.delete('/groups/:groupId/chat/:chatRoomId/:memberId', (req, res, next) => {
    data.deleteGroupMemberFromChatRoom(req.params.groupId, req.params.chatRoomId, req.params.memberId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});


module.exports = router;