const express = require("express");
const router = express.Router();
const dataService = require("./defaultEventCategoryService");
const data = dataService();

// get list of defaultEventCategory 
router.get('/defaultEventCategory', (req, res, next) => {
    data.getDefaultEventCategory().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add defaultEventCategory
router.post('/defaultEventCategory', (req, res, next) => {
    data.addDefaultEventCategory(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get defaultEventCategory by id
router.get('/defaultEventCategory/:defaultEventCategoryId', (req, res, next) => {
    data.getDefaultEventCategoryById(req.params.defaultEventCategoryId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update defaultEventCategory in db
router.put('/defaultEventCategory/:id', (req, res, next) => {
    data.updateDefaultEventCategoryById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete defaultEventCategory in db
router.delete('/defaultEventCategory/:id', (req, res, next) => {
    data.deleteDefaultEventCategoryById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;