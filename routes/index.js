var cuisines = require('./cuisines/cuisines');
var groups = require('./groups/groups');
var marks = require('./marks/marks');
var priceRanges = require('./priceRanges/priceRanges');
var restaurants = require('./restaurants/restaurants');
var review = require('./reviews/reviews');
var users = require('./users/users');
var unverifiedUser = require('./unverifiedUser/unverifiedUser');

const express = require("express");
const router = express.Router();

router.get('/*', function (req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

router.use('/', cuisines);
router.use('/', groups);
router.use('/', marks);
router.use('/', priceRanges);
router.use('/', restaurants);
router.use('/', review);
router.use('/', users);
router.use('/', unverifiedUser);

module.exports = router;