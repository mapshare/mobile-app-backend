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

//add group
router.post('/groups', (req, res, next) => {
    data.addGroup(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

//list members of group
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

// delete Group in db
router.delete('/groups/:id', (req, res, next) => {
    data.deleteGroupById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;