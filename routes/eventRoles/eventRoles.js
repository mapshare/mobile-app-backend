const express = require("express");
const router = express.Router();
const dataService = require("./eventRolesService");
const data = dataService();

// get list of EventRoles 
router.get('/eventRoles', (req, res, next) => {
    data.getEventRoles().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add EventRoles
router.post('/eventRoles', (req, res, next) => {
    data.addEventRoles(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get EventRoles by id
router.get('/eventRoles/:eventRolesId', (req, res, next) => {
    data.getEventRolesById(req.params.eventRolesId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update EventRoles in db
router.put('/eventRoles/:id', (req, res, next) => {
    data.updateEventRolesById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete EventRoles in db
router.delete('/eventRoles/:id', (req, res, next) => {
    data.deleteEventRolesById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;