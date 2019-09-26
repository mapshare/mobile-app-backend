const express = require("express");
const router = express.Router();
const dataService = require("./userEventService");
const data = dataService();

// get list of UserEvent 
router.get('/userEvent', (req, res, next) => {
    data.getUserEvent().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add UserEvent
router.post('/userEvent', (req, res, next) => {
    data.addUserEvent(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get UserEvent by id
router.get('/userEvent/:userEventId', (req, res, next) => {
    data.getUserEventById(req.params.userEventId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update UserEvent in db
router.put('/userEvent/:id', (req, res, next) => {
    data.updateUserEventById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete UserEvent in db
router.delete('/userEvent/:id', (req, res, next) => {
    data.deleteUserEventById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;