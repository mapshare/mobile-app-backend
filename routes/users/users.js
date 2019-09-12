const express = require("express");
const router = express.Router();
const dataService = require("./userService");
// const dataService = require("../../dataService");
const data = dataService();

// get all users // remove in production!
router.get('/users', (req, res, next) => {
    data.getUsers().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'ilya error?': err })
    })
});

// add new user
router.post('/users', (req, res, next) => {
    //data.addUser(req.body).then(data => {
    data.processUser(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send(err)
    })
});

// get user by id
router.get('/users/:id', (req, res, next) => {
    data.getUserById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
})

// add user to existing group (or other update?)
router.put('/users/:id', (req, res, next) => {
    data.updateUserById(req.params.id, req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;