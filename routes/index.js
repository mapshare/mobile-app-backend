var GroupFeed = require('./GroupFeed/groupFeed');
var Post = require('./Post/post');
var groups = require('./groups/groups');
var marks = require('./marks/marks');
var restaurants = require('./restaurants/restaurants');
var review = require('./reviews/reviews');
var users = require('./users/users');

const express = require("express");
const router = express.Router();

router.get('/*', function (req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

router.use('/', GroupFeed);
router.use('/', groups);
router.use('/', marks);
router.use('/', Post);
router.use('/', restaurants);
router.use('/', review);
router.use('/', users);

module.exports = router;