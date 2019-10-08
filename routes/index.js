var GroupFeed = require("./groupFeed/groupFeed");
var GroupMarks = require("./groupMarks/groupMarks");
var GroupRoles = require("./groupRoles/groupRoles");
var Groups = require("./groups/groups");
var GroupMember = require("./groupMember/groupMember");
var GroupEvents = require("./groupEvents/groupEvents");
var Users = require("./users/users");
var DefaultCategory = require("./defaultCategory/defaultCategory");
var Auth = require("./auth/auth");

const express = require("express");
const router = express.Router();

router.get("/*", function(req, res, next) {
	res.setHeader("Last-Modified", new Date().toUTCString());
	next();
});

router.use("/", GroupFeed);
router.use("/", GroupMarks);
router.use("/", Groups);
router.use("/", GroupRoles);
router.use("/", GroupMember);
router.use("/", GroupEvents);
router.use("/", Users);
router.use("/", DefaultCategory);
router.use("/", Auth);

module.exports = router;
