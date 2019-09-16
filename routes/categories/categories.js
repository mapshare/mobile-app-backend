const express = require("express");
const router = express.Router();
const dataService = require("./categoriesService");
const data = dataService();

//Get list of Categories
router.get('/categories', (req, res, next) => {
    data.getGroupFeed().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

//Add to list of Categories
router.post('/categories', (req, res, next) => {
    data.addGroupFeed(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

//Get Categories by ID
router.get('/categories/:categoriesId', (req, res, next) => {
    data.getGroupFeedById(req.params.groupFeedId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

module.exports = router;