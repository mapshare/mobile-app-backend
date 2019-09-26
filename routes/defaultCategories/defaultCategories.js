const express = require("express");
const router = express.Router();
const dataService = require("./defaultCategoriesService");
const data = dataService();

// get list of default categories
router.get('/dCategories', (req, res, next) => {
    data.getCategories().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'ilya error?': err })
    })
});

//add default Categories
router.post('/dCategories', (req, res, next) => {
    data.addCategory(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

//list default category by ID
router.get('/dCategories/:dCategoriesId', (req, res, next) => {
    data.getCategory(req.params.dCategoriesId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;