const express = require("express");
const router = express.Router();
const dataService = require("./groupMemberService");
const data = dataService();

// get list of GroupMember 
router.get('/groupMember', (req, res, next) => {
    data.getGroupMember().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add GroupMember
router.post('/groupMember', (req, res, next) => {
    data.addGroupMember(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get GroupMember by id
router.get('/groupMember/:groupMemberId', (req, res, next) => {
    data.getGroupMemberById(req.params.groupMemberId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update GroupMember in db
router.put('/groupMember/:id', (req, res, next) => {
    data.updateGroupMemberById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete GroupMember in db
router.delete('/groupMember/:id', (req, res, next) => {
    data.deleteGroupMemberById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;