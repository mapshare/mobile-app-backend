const express = require("express");
const router = express.Router();
const dataService = require("./groupFeedService");
const data = dataService();

/*
Group Feed ROUTES:
------------------------------------------------------------
GET     /groupFeed      = list all groupFeed
GET     /groupFeed/:id  = list groupFeed by id
POST    /groupFeed      = add groupFeed
PUT     /groupFeed/:id  = update groupFeed by id
DELETE  /groupFeed/:id  = Delete groupFeed by id
*/


// get list of GroupFeed 
router.get('/groupFeed', (req, res, next) => {
    data.getGroupFeed().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add GroupFeed
router.post('/groupFeed', (req, res, next) => {
    data.addGroupFeed(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get GroupFeed by id
router.get('/groupFeed/:groupFeedId', (req, res, next) => {
    data.getGroupFeedById(req.params.groupFeedId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update GroupFeed in db
router.put('/groupFeed/:id', (req, res, next) => {
    data.updateGroupFeedById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete GroupFeed in db
router.delete('/groupFeed/:id', (req, res, next) => {
    data.deleteGroupFeedById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;