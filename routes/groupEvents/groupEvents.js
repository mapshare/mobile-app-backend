const express = require("express");
const router = express.Router();
const dataService = require("./groupEventService");
const data = dataService();


/*
Group Events ROUTES:
------------------------------------------------------------
GET     /groupEvent      = list all groupEvent
GET     /groupEvent/:id  = list groupEvent by id
POST    /groupEvent      = add groupEvent
PUT     /groupEvent/:id  = update groupEvent by id
DELETE  /groupEvent/:id  = Delete groupEvent by id
*/

// get list of GroupEvent 
router.get('/groupEvent', (req, res, next) => {
    data.getGroupEvent().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add GroupEvent
router.post('/groupEvent', (req, res, next) => {
    data.addGroupEvent(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get GroupEvent by id
router.get('/groupEvent/:groupEventId', (req, res, next) => {
    data.getGroupEventById(req.params.groupEventId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update GroupEvent in db
router.put('/groupEvent/:id', (req, res, next) => {
    data.updateGroupEventById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete GroupEvent in db
router.delete('/groupEvent/:id', (req, res, next) => {
    data.deleteGroupEventById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;