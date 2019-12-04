const express = require("express");
const router = express.Router();
const dataService = require("./defaultCategoryService");
const data = dataService();

/*
Group Default Category ROUTES:
------------------------------------------------------------
GET     /defaultCategory      = list all defaultCategory
GET     /defaultCategory/:id  = list defaultCategory by id
POST    /defaultCategory      = add defaultCategory
PUT     /defaultCategory/:id  = update defaultCategory by id
DELETE  /defaultCategory/:id  = Delete defaultCategory by id
*/

// get list of defaultCategory 
router.get('/defaultCategory', (req, res, next) => {
    data.getDefaultCategory().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add defaultCategory
router.post('/defaultCategory', (req, res, next) => {
    data.addDefaultCategory(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get defaultCategory by id
router.get('/defaultCategory/:defaultCategoryId', (req, res, next) => {
    data.getDefaultCategoryById(req.params.defaultCategoryId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update defaultCategory in db
router.put('/defaultCategory/:id', (req, res, next) => {
    data.updateDefaultCategoryById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete defaultCategory in db
router.delete('/defaultCategory/:id', (req, res, next) => {
    data.deleteDefaultCategoryById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;