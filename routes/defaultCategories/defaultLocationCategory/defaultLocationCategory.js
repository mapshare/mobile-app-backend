const express = require("express");
const router = express.Router();
const dataService = require("./defaultLocationCategoryService");
const data = dataService();

// get list of defaultLocationCategory 
router.get('/defaultLocationCategory', (req, res, next) => {
    data.getDefaultLocationCategory().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add defaultLocationCategory
router.post('/defaultLocationCategory', (req, res, next) => {
    data.addDefaultLocationCategory(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get defaultLocationCategory by id
router.get('/defaultLocationCategory/:defaultLocationCategoryId', (req, res, next) => {
    data.getDefaultLocationCategoryById(req.params.defaultLocationCategoryId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update defaultLocationCategory in db
router.put('/defaultLocationCategory/:id', (req, res, next) => {
    data.updateDefaultLocationCategoryById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete defaultLocationCategory in db
router.delete('/defaultLocationCategory/:id', (req, res, next) => {
    data.deleteDefaultLocationCategoryById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;