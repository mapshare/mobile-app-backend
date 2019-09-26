const express = require("express");
const router = express.Router();
const dataService = require("./defaultPostCategoryService");
const data = dataService();

// get list of defaultPostCategory 
router.get('/defaultPostCategory', (req, res, next) => {
    data.getDefaultPostCategory().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add defaultPostCategory
router.post('/defaultPostCategory', (req, res, next) => {
    data.addDefaultPostCategory(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get defaultPostCategory by id
router.get('/defaultPostCategory/:defaultPostCategoryId', (req, res, next) => {
    data.getDefaultPostCategoryById(req.params.defaultPostCategoryId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update defaultPostCategory in db
router.put('/defaultPostCategory/:id', (req, res, next) => {
    data.updateDefaultPostCategoryById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete defaultPostCategory in db
router.delete('/defaultPostCategory/:id', (req, res, next) => {
    data.deleteDefaultPostCategoryById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;