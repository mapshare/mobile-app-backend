const express = require("express");
const router = express.Router();
const dataService = require("./groupsService");
//const dataService = require("../../dataService");
const data = dataService();

//list groups
router.get('/groups', (req, res, next) => {
    data.getGroups().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'ilya error?': err })
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

module.exports = router;