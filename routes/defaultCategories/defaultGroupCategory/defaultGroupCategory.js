const express = require("express");
const router = express.Router();
const dataService = require("./defaultGroupCategoryService");
const data = dataService();

// get list of defaultGroupCategory 
router.get('/defaultGroupCategory', (req, res, next) => {
    data.getDefaultGroupCategory().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add defaultGroupCategory
router.post('/defaultGroupCategory', (req, res, next) => {
    data.addDefaultGroupCategory(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get defaultGroupCategory by id
router.get('/defaultGroupCategory/:defaultGroupCategoryId', (req, res, next) => {
    data.getDefaultGroupCategoryById(req.params.defaultGroupCategoryId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update defaultGroupCategory in db
router.put('/defaultGroupCategory/:id', (req, res, next) => {
    data.updateDefaultGroupCategoryById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete defaultGroupCategory in db
router.delete('/defaultGroupCategory/:id', (req, res, next) => {
    data.deleteDefaultGroupCategoryById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;