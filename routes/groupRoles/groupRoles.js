const express = require("express");
const router = express.Router();
const dataService = require("./groupRolesServices");
const data = dataService();

/*
Group Roles ROUTES:
------------------------------------------------------------
GET     /groupRoles      = list all groupRoles
GET     /groupRoles/:id  = list groupRoles by id
POST    /groupRoles      = add groupRoles
PUT     /groupRoles/:id  = update groupRoles by id
DELETE  /groupRoles/:id  = Delete groupRoles by id
*/

// get list of GroupRoles 
router.get('/groupRoles', (req, res, next) => {
    data.getGroupRoles().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add GroupRoles
router.post('/groupRoles', (req, res, next) => {
    data.addGroupRoles(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get GroupRoles by id
router.get('/groupRoles/:groupRolesId', (req, res, next) => {
    data.getGroupRolesById(req.params.groupRolesId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update GroupRoles in db
router.put('/groupRoles/:id', (req, res, next) => {
    data.updateGroupRolesById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// delete GroupRoles in db
router.delete('/groupRoles/:id', (req, res, next) => {
    data.deleteGroupRolesById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;