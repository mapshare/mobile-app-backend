const express = require("express");
const router = express.Router();
const dataService = require("./cuisinesService");
//const dataService = require("../../dataService");
const data = dataService();

// provide options for cuisines?
router.get('/cuisines', (req, res, next) => {
    res.send({ type: 'GET all cuisines' });
});

// get restaurants of specific cuisine
router.get('/cuisines/:cuisine', (req, res, next) => {
    res.send({ type: 'GET restaurants of specific cuisine' });
});

module.exports = router;