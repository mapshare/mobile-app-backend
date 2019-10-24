require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Handlebars = require('handlebars');
const fs = require("fs");
const path = require('path');
var hbs = require('nodemailer-express-handlebars');

const User = require("../../models/user");
const UnverifiedUser = require("../../models/unverifiedUser");
const { verifyTokenEmail } = require("./verifyTokenEmail");
const transporter = require("./html/email/transporter");
// TESTING ONLY REGISTER

// register new user
router.post("/testregister", async (req, res, next) => {
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

// register new user
router.post("/register", async (req, res, next) => {
	try {
		// Verify if a user already exists.
		const emailExist = await User.findOne({ userEmail: req.body.userEmail });
		if (emailExist) { throw ("An account with this email already exists!!"); }

		// Verify if a Unverified User already exists.
		const UnverifiedUserEmailExist = await UnverifiedUser.findOne({ unverifiedUserEmail: req.body.userEmail });
		if (UnverifiedUserEmailExist) { throw ("An account with this email already exists!"); }

		// Hashing passwords
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.userPassword, salt);

		const newUnverifiedUser = new UnverifiedUser({
			unverifiedUserEmail: req.body.userEmail,
			unverifiedUserFirstName: req.body.userFirstName,
			unverifiedUserLastName: req.body.userLastName,
			unverifiedUserPassword: hashPassword
		});

		// Save User
		const savedUser = await newUnverifiedUser.save();

		// Send verification email
		const emailToken = jwt.sign({ savedUser: savedUser }, process.env.EMAIL_TOKEN, { expiresIn: '1h' });

		// create verification url
		const verifyUrl = process.env.API_URL + `/verify/${emailToken}`;

		// config compiler
		var options = {
			viewEngine: {
				extname: '.hbs',
				layoutsDir: 'routes/auth/html/email/',
				defaultLayout: 'template',
				partialsDir: 'routes/auth/html/partials/'
			},
			viewPath: 'routes/auth/html/email',
			extName: '.hbs'
		};

		// Send email
		transporter.use('compile', hbs(options));

		var mail = {
			to: savedUser.unverifiedUserEmail,
			subject: "Welcome to Pin It",
			template: 'emailVerification',
			context: {
				firstName: savedUser.unverifiedUserFirstName,
				verifyUrl: verifyUrl
			}
		};

		const status = await transporter.sendMail(mail);
		
		res.send({ success: true });
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get("/verify/:token", verifyTokenEmail, async (req, res, next) => {
	try {
		var success = false;
		var error = false;
		var firstName = "";

		const userExists = await User.findOne({ userEmail: req.unverifiedUser.savedUser.unverifiedUserEmail })
		if (!userExists) {

			const verifiedUser = await UnverifiedUser.findById(req.unverifiedUser.savedUser._id)
			if (!verifiedUser) { throw ("user not found."); };


			const newUser = new User({
				userEmail: verifiedUser.unverifiedUserEmail,
				userFirstName: verifiedUser.unverifiedUserFirstName,
				userLastName: verifiedUser.unverifiedUserLastName,
				userPassword: verifiedUser.unverifiedUserPassword
			});

			const savedUser = await newUser.save();

			const deleteUnverified = await UnverifiedUser.deleteOne({ _id: req.unverifiedUser.savedUser._id });

			firstName = savedUser.userFirstName;
			success = true;
		} else {
			success = true; 4
			error = false;
			firstName = userExists.userFirstName;
		}

		const myPath = path.join(__dirname, "/html/web/success.hbs");
		const source = fs.readFileSync(myPath, 'utf8');
		const template = Handlebars.compile(source, { strict: true });
		const result = template({ success: success, error: error, firstName: firstName });
		res.send(result);

	} catch (error) {
		res.status(400).send("Unable to verify user: " + error);
	}
});

// login user
router.post("/login", async (req, res, next) => {
	// Verify if the user already exists
	const user = await User.findOne({ userEmail: req.body.userEmail });
	if (!user) return res.status(400).send("Email or Password is Wrong");
	// Verify if password is correct
	const validPassword = await bcrypt.compare(
		req.body.userPassword,
		user.userPassword
	);
	if (!validPassword) return res.status(400).send("Email or Password is Wrong");

	// Create an user logged in token and its header name tag. Add a expiry if needed by adding { expiresIn: '1h' }
	const token = jwt.sign({ _id: user._id }, process.env.LOGIN_TOKEN);
	res.setHeader("authentication", token);

	res.send(user);
});

module.exports = router;
