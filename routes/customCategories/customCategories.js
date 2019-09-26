
const express = require("express");
const router = express.Router();
const dataService = require("./customCategoriesService");
const data = dataService();

// get list of custom categories
router.get('/cCategories', (req, res, next) => {
    data.getCategories().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'ilya error?': err })
    })
});

//add custom Categories
router.post('/cCategories', (req, res, next) => {
    data.addCategory(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

//list custom category by ID
router.get('/cCategories/:cCategoriesId', (req, res, next) => {
    data.getCategory(req.params.cCategoriesId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;