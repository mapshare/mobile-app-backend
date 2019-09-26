var GroupFeed = require('./GroupFeed/groupFeed');
var GroupRoles = require('./groupRoles/groupRoles');
var EventRoles = require('./eventRoles/eventRoles');
var Groups = require('./groups/groups');
var UserGroup = require('./userGroup/userGroup');
var GroupLocation = require('./groupLocation/groupLocation');
var GroupEvents = require('./groupEvents/groupEvents');
var Users = require('./users/users');
var UserEvent = require('./userEvent/userEvent');
var DefaultEventCategory = require('./defaultCategories/defaultEventCategory/defaultEventCategory');
var DefaultGroupCategory = require('./defaultCategories/defaultGroupCategory/defaultGroupCategory');
var DefaultLocationCategory = require('./defaultCategories/defaultLocationCategory/defaultLocationCategory');
var DefaultPostCategory = require('./defaultCategories/defaultPostCategory/defaultPostCategory');


const express = require("express");
const router = express.Router();

router.get('/*', function (req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

router.use('/', GroupFeed);
router.use('/', Groups);
router.use('/', GroupRoles);
router.use('/', UserGroup);
router.use('/', GroupLocation);
router.use('/', GroupEvents);
router.use('/', Users);
router.use('/', EventRoles);
router.use('/', UserEvent);
router.use('/', DefaultEventCategory);
router.use('/', DefaultGroupCategory);
router.use('/', DefaultLocationCategory);
router.use('/', DefaultPostCategory);
module.exports = router;