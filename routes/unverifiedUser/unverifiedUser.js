const express = require("express");
const router = express.Router();
const dataService = require("./unverifiedUserService");
const data = dataService();

// add unverifiedUser
router.post('/unverifiedUser', (req, res, next) => {
    data.addUnverifiedUser(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// get list of unverifiedUser 
router.get('/unverifiedUser', (req, res, next) => {
    data.getUnverifiedUser().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// get unverifiedUser by id
router.get('/unverifiedUser/:unverifiedUserId', (req, res, next) => {
    data.getUnverifiedUserById(req.params.unverifiedUserId).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update unverifiedUser in db
router.put('/unverifiedUser/:id', (req, res, next) => {
    data.updateUnverifiedUserById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete unverifiedUser in db
router.delete('/unverifiedUser/:id', (req, res, next) => {
    data.deleteUnverifiedUserById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router; 