const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

// register new user
router.post("/register", async (req, res, next) => {
	//Verify if the user already exits
	const emailExist = await User.findOne({ userEmail: req.body.userEmail });
	if (emailExist) return res.status(400).send("Email already exists!");

	//Hashing passwords
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.userPassword, salt);

	const newUser = new User({
		...req.body,
		userPassword: hashPassword
	});

	try {
		const savedUser = await newUser.save();
		res.send({ success: true });
	} catch (err) {
		res.status(400).send(err);
	}
});

// login user
router.post("/login", async (req, res, next) => {
	//Verify if the user already exits
	const user = await User.findOne({ userEmail: req.body.userEmail });
	if (!user) return res.status(400).send("Email or Password is Wrong");
	//Verify if password is correct
	const validPassword = await bcrypt.compare(
		req.body.userPassword,
		user.userPassword
	);
	if (!validPassword) return res.status(400).send("Email or Password is Wrong");

	//Create an user logged in token and its header name tag
	const token = jwt.sign({ _id: user._id }, process.env.LOGIN_TOKEN, { expiresIn: '1h' });
	res.setHeader("authentication", token);

	res.send("Logged In!");
});

module.exports = router;
