const express = require("express");
const router = express.Router();
const dataService = require("./userGroupService");
const data = dataService();

// get list of UserGroup 
router.get('/userGroup', (req, res, next) => {
    data.getUserGroup().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add UserGroup
router.post('/userGroup', (req, res, next) => {
    data.addUserGroup(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get UserGroup by id
router.get('/userGroup/:userGroupId', (req, res, next) => {
    data.getUserGroupById(req.params.userGroupId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update UserGroup in db
router.put('/userGroup/:id', (req, res, next) => {
    data.updateUserGroupById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete UserGroup in db
router.delete('/userGroup/:id', (req, res, next) => {
    data.deleteUserGroupById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;