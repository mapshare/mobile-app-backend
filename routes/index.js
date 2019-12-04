module.exports = (io) => {
	var Groups = require("./groups/groups")(io);
	var Users = require("./users/users");
	var Auth = require("./auth/auth");

	const express = require("express");
	const router = express.Router();

	router.get("/*", function (req, res, next) {
		res.setHeader("Last-Modified", new Date().toUTCString());
		next();
	});

	router.use("/", Groups);
	router.use("/", Users);
	router.use("/", Auth);

	return router;
} 
