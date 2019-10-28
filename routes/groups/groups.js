module.exports = (io) => {
    const express = require("express");
    const router = express.Router();
    const dataService = require("./groupsService");
    const data = dataService(io);
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

    // Search for group
    router.post('/groups/search', verifyLoginToken, async (req, res, next) => {
        try {
            const results = await data.searchGroups(req.body);
            res.status(200).json(results);
        } catch (error) {
            res.status(400).send({ 'error': error });
        }
    });


    // Search for group chat room
    router.post('/groups/:groupId/chat/search', verifyLoginToken, async (req, res, next) => {
        try {
            const results = await data.searchGroupChatRooms(req.params.groupId, req.body);
            res.status(200).json(results);
        } catch (error) {
            res.status(400).send({ 'error': error });
        }
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
    router.put('/groups/:groupId', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const results = await data.updateGroupById(req.params.groupId, req.body);
                res.status(200).json(results);
            } else {
                throw ("Insufficient permissions to update this group");
            }
        } catch (error) {
            res.status(400).send({ "error": error });
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
            res.status(400).send({ "error": "Insufficient permissions to add member to this group" })
        }
    });


    // add Group Member to Event
    router.post('/groups/:groupId/event/:eventId', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const results = await data.addGroupMemberToEvent(req.params.groupId, req.user, req.params.eventId, req.body);
                res.status(200).json(results);
            } else {
                throw ("Insufficient permissions to add member to this event");
            }
        } catch (error) {
            res.status(400).send({ "error": error })
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
            res.status(400).send({ "error": "Insufficient permissions to add mark to this group" })
        }
    });

    // add Group Post
    router.post('/groups/:groupId/post', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const results = await data.addGroupPost(req.params.groupId, req.user, req.body);
                res.status(200).json(results);
            } else {
                throw ("Insufficient permissions to add post to this group");
            }
        } catch (error) {
            res.status(400).send({ "error": error });
        }

    });

    // add Group Event
    router.post('/groups/:id/event', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const eventData = await data.addGroupEvent(req.params.id, req.user, req.body);
                res.status(200).json(eventData);
            } else {
                throw ({ "error": "Insufficient permissions to add event to this group" });
            }
        } catch (error) {
            res.status(400).send(error);
        }
    });

    // add custom mark category
    router.post('/groups/:groupId/customCategory', verifyLoginToken, (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                data.addCustomCategoryMark(req.params.groupId, req.body).then(data => {
                    res.status(200).json(data)
                }).catch(err => {
                    throw ({ "error": err })
                })
            } else {
                throw ({ "error": "Insufficient permissions to add mark category to this group" })
            }
        } catch (error) {
            res.status(400).send(error);
        }
    });

    // add Group Chat Room
    router.post('/groups/:groupId/chat', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const results = await data.addChatRoom(req.params.groupId, req.user, req.body);
                res.status(200).json(results);
            } else {
                throw ("Insufficient permissions to add chat room to this group");
            }
        } catch (error) {
            res.status(400).send({ "error": error })
        }

    });

    // add Group Member to Chat Room
    router.post('/groups/:groupId/chat/:chatRoomId', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const results = await data.addGroupMemberToChatRoom(req.params.groupId, req.user, req.params.chatRoomId);
                res.status(200).json(results)
            } else {
                throw ("Insufficient permissions to add Group Member to this Chat Room")
            }
        } catch (error) {
            res.status(400).send({ "error": error })
        }

    });

    // add Chat Message to chatRoom
    router.post('/groups/:groupId/chat/:chatRoomId/message', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const results = await data.addChatMessage(req.params.groupId, req.user, req.params.chatRoomId, req.body);
                res.status(200).json(results);
            } else {
                throw ("Insufficient permissions to add Chat Message to this chatRoom");
            }
        } catch (error) {
            res.status(400).send({ "error": error })
        }

    });

    // get Group Member
    router.get('/groups/:groupId', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_MEMBER)) {
                const results = await data.getGroupMember(req.params.groupId, req.user);
                res.status(200).json(results);
            } else {
                throw ("Insufficient permissions to get member for this group");
            }
        } catch (error) {
            res.status(400).send({ "error": error });
        }
    });

    // get Group Mark
    router.get('/groups/:groupId/mark/:markId', verifyLoginToken, (req, res, next) => {
        if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
            data.getGroupMark(req.params.groupId, req.params.markId).then(data => {
                res.status(200).json(data)
            }).catch(err => {
                res.status(400).send({ "error": err })
            })
        } else {
            res.status(400).send({ "error": "Insufficient permissions to get marks for this group" })
        }
    });

    // get Group Post
    router.get('/groups/:groupId/post/:postId', verifyLoginToken, (req, res, next) => {
        if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
            data.getGroupPost(req.params.groupId, req.params.postId).then(data => {
                res.status(200).json(data)
            }).catch(err => {
                res.status(400).send({ "error": err })
            })
        } else {
            res.status(400).send({ "error": "Insufficient permissions to get posts for this group" })
        }
    });

    // get Group Event
    router.get('/groups/:groupId/event/:eventId', verifyLoginToken, (req, res, next) => {
        if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
            data.getGroupEvent(req.params.groupId, req.params.eventId).then(data => {
                res.status(200).json(data)
            }).catch(err => {
                res.status(400).send({ "error": err })
            })
        } else {
            res.status(400).send({ "error": "Insufficient permissions to get events for this group" })
        }
    });

    // get custom mark category 
    router.get('/groups/:groupId/customCategory/:categoryId', verifyLoginToken, (req, res, next) => {
        if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
            data.getCustomCategoryMark(req.params.groupId, req.params.categoryId).then(data => {
                res.status(200).json(data)
            }).catch(err => {
                res.status(400).send({ "error": err })
            })
        } else {
            res.status(400).send({ "error": "Insufficient permissions to get mark categories for this group" })
        }
    });

    // get Group Chat Room
    router.get('/groups/:groupId/chat/:chatRoomId', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const results = await data.getChatRoom(req.params.groupId, req.params.chatRoomId);
                res.status(200).json(results)
            } else {
                throw ("Insufficient permissions to get chat room for this group")
            }
        } catch (error) {
            res.status(400).send({ "error": error })
        }

    });

    // get list of Group Chat Rooms
    router.get('/groups/:groupId/chat', verifyLoginToken, (req, res, next) => {
        if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
            data.getListOfChatRooms(req.params.groupId).then(data => {
                res.status(200).json(data)
            }).catch(err => {
                res.status(400).send({ "error": err })
            })
        } else {
            res.status(400).send({ "error": "Insufficient permissions to get chat room for this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to update marks for this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to update posts for this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to update events for this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to update mark categories for this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to update chat rooms for this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to update chat messages this group" })
        }
    });

    // delete Group member
    router.delete('/groups/:groupId/member', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const results = await data.deleteGroupMember(req.params.groupId, req.user, req.params.id);
                res.status(200).json(results);
            } else {
                throw ("Insufficient permissions to delete group member from this group");
            }
        } catch (error) {
            res.status(400).send({ "error": error });
        }

    });

    // delete Group Member from Event
    router.delete('/groups/:groupId/event/:eventId/leave', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const results = await data.deleteGroupMemberFromEvent(req.params.groupId, req.user, req.params.eventId);
                res.status(200).json(results)
            } else {
                throw ("Insufficient permissions to delete group member from this event")
            }
        } catch (error) {
            res.status(400).send({ "error": error })
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
            res.status(400).send({ "error": "Insufficient permissions to delete mark categories from this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to delete marks from this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to delete posts from this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to delete events from this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to delete chat rooms from this group" })
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
            res.status(400).send({ "error": "Insufficient permissions to delete chat messages from this group" })
        }
    });

    // delete Group Member From Chat Room
    router.delete('/groups/:groupId/chat/:chatRoomId/leave', verifyLoginToken, async (req, res, next) => {
        try {
            if (verifyRole(req.user, req.params.groupId, process.env.ROLE_ADMIN)) {
                const result = await data.deleteGroupMemberFromChatRoom(req.params.groupId, req.user, req.params.chatRoomId);
                res.status(200).json(result)
            } else {
                throw ("Insufficient permissions to delete group member from this chatroom")
            }
        } catch (error) {
            res.status(400).send({ "error": error })
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

    return router;
}