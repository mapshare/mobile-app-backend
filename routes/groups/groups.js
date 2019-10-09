const express = require("express");
const router = express.Router();
const dataService = require("./groupsService");
const data = dataService();
const { verifyLoginToken } = require("../auth/verifyToken");
const { verifyRole } = require("../auth/verifyRole");

// get list of groups
router.get('/groups', verifyLoginToken, (req, res, next) => {
    data.getGroups().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'error': err })
    })
});

// add group
router.post('/groups', verifyLoginToken, (req, res, next) => {
    data.addGroup(req.user, req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

// get group information
router.get('/groups/:groupId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_MEMBER)) {
        data.getGroup(req.params.groupId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to view this group" })
    }
});

// update Group
router.put('/groups/:groupId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.updateGroupById(req.params.groupId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// add Group member
router.post('/groups/:groupId/member', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.addGroupMember(req.params.groupId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});


// add Group Member to Event
router.post('/groups/:groupId/event/:eventId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.addGroupMemberToEvent(req.params.groupId, req.params.eventId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});


// add Group Mark
router.post('/groups/:id/mark', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.addGroupMark(req.params.id, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// add Group Post
router.post('/groups/:id/post', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.addGroupPost(req.params.id, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// add Group Event
router.post('/groups/:id/event', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.addGroupEvent(req.params.id, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// add custom mark category
router.post('/groups/:groupId/customCategory', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.addCustomCategoryMark(req.params.groupId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// add Group Chat Room
router.post('/groups/:groupId/chat', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.addChatRoom(req.params.groupId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// add Group Member to Chat Room
router.post('/groups/:groupId/chat/:chatRoomId/:groupMemberId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.addGroupMemberToChatRoom(req.params.groupId, req.params.chatRoomId, req.params.groupMemberId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// add Chat Message to chatRoom
router.post('/groups/:groupId/chat/:chatRoomId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.addChatMessage(req.params.groupId, req.params.chatRoomId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// get Group Mark
router.get('/groups/:id/mark/:markId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.getGroupMark(req.params.id, req.params.markId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// get Group Post
router.get('/groups/:id/post/:postId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.getGroupPost(req.params.id, req.params.postId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// get Group Event
router.get('/groups/:id/event/:eventId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.getGroupEvent(req.params.id, req.params.eventId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// get custom mark category to event
router.get('/groups/:groupId/customCategory/:categoryId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.getCustomCategoryMark(req.params.groupId, req.params.categoryId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// get Group Chat Room
router.get('/groups/:groupId/chat/:chatRoomId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.getChatRoom(req.params.groupId, req.params.chatRoomId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// update Group Mark
router.put('/groups/:id/mark/:markId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.updateGroupMark(req.params.id, req.params.markId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// update Group Post
router.put('/groups/:id/post/:postId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.updateGroupPost(req.params.id, req.params.postId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// update Group Event
router.put('/groups/:id/event/:eventId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.updateGroupEvent(req.params.id, req.params.eventId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// update custom mark category to event
router.put('/groups/:groupId/customCategory/:categoryId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.updateCustomCategoryMark(req.params.groupId, req.params.categoryId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// update Group Chat Room
router.put('/groups/:groupId/chat/:chatRoomId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.updateChatRoom(req.params.groupId, req.params.chatRoomId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// update Chat Messages
router.put('/groups/:groupId/chat/:chatRoomId/:chatMessageId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.updateChatMessage(req.params.groupId, req.params.chatRoomId, req.params.chatMessageId, req.body).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// delete Group member
router.delete('/groups/:groupId/member/:id', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteGroupMember(req.params.groupId, req.params.id).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// delete Group Member from Event
router.delete('/groups/:groupId/event/:eventId/:memberId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteGroupMemberFromEvent(req.params.groupId, req.params.eventId, req.params.memberId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// delete custom mark category to event
router.delete('/groups/:groupId/customCategory/:id', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteCustomCategoryMark(req.params.groupId, req.params.id).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});


// delete Group Mark
router.delete('/groups/:groupId/mark/:id', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteGroupMark(req.params.groupId, req.params.id).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// delete Group Post
router.delete('/groups/:groupId/post/:id', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteGroupPost(req.params.groupId, req.params.id).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// delete Group Event
router.delete('/groups/:groupId/event/:id', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteGroupEvent(req.params.groupId, req.params.id).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});


// delete Group Chat Room
router.delete('/groups/:groupId/chat/:chatRoomId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteChatRoom(req.params.groupId, req.params.chatRoomId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// delete Chat Messages
router.delete('/groups/:groupId/chat/:chatRoomId/message/:chatMessageId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteChatMessage(req.params.groupId, req.params.chatRoomId, req.params.chatMessageId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// delete Group Member From Chat Room
router.delete('/groups/:groupId/chat/:chatRoomId/:memberId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteGroupMemberFromChatRoom(req.params.groupId, req.params.chatRoomId, req.params.memberId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to update this group" })
    }
});

// delete Group 
router.delete('/groups/:groupId', verifyLoginToken, (req, res, next) => {
    if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
        data.deleteGroupById(req.params.groupId).then(data => {
            res.status(200).json(data)
        }).catch(err => {
            res.status(400).send({ "error": err })
        })
    } else {
        res.status(400).send({ "error": "Insufficient permissions to delete this group" })
    }
});


module.exports = router;