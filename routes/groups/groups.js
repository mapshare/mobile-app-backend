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
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// add Group member
router.post('/groups/:id/member', (req, res, next) => {
    data.addGroupMember(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});


// add Group Mark
router.post('/groups/:id/mark', (req, res, next) => {
    data.addGroupMark(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// add Group Post
router.post('/groups/:id/post', (req, res, next) => {
    data.addGroupPost(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// add Group Event
router.post('/groups/:id/event', (req, res, next) => {
    data.addGroupEvent(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// add Group Member to Event
router.post('/groups/:groupId/event/:eventId', (req, res, next) => {
    data.addGroupMemberToEvent(req.params.groupId, req.params.eventId, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// add custom mark category to event
router.post('/groups/:groupId/customCategory', (req, res, next) => {
    data.addCustomCategoryMark(req.params.groupId, req.body).then(data => {
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
        console.log(err);
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

module.exports = router;