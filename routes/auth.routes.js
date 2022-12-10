var bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const sanitize = require('mongo-sanitize');
const { checkDuplicateUsernameOrEmail, credentialsAreValid, sessionIsValid} = require("../middleware/auth");
const { logger } = require("../middleware/serverLogger");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.use((req, res, next) => {
		// sanitize() removes any characters that could be used to execute code on the server or to inject malicious code into the database
		// all user input is sanitized as it enters the server to prevent injection attacks
		// if req.body is empty, and the request is a post, log an error on server
		if (req.body && Object.keys(req.body).length === 0 && req.method === 'POST') {
			logger.error("Empty body in request");
			res.status(400).send({ message: "Empty body in request" });
		}
		req.body = sanitize(req.body);
		next();
	})

	app.post("/api/auth/signup", checkDuplicateUsernameOrEmail, (req, res) => {
		new User({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(11))
			// bcryptjs hashes the password using a salt and returns the hash
			// The salt makes it impossible to generate the same hash from the same password
			// The salted hash is then stored in the database
		}).save((err, user) => {
			if (err) res.status(500).send({ message: err }); 
			logger.info("User created: " + user.username + " : " + user.email);
			res.status(200).render('successRedirect', {data: { message: "User Registered Syccessfully.", redirectUrl: "/login"}});
		});
	});

	app.post("/api/auth/login", credentialsAreValid, (req, res) => {
		logger.info("User logged in: " + req.session.user.username + "; sid: " + req.sessionID);
		res.json({success: true, message: "Login Successful. Cookie set."});
		// res.status(200).render('successRedirect', {data: { message: "Login Successful.", redirectUrl: "/login"}});
		// Redirect to lobby
		
	});

	app.get("/api/auth/logout", (req, res) => {
		logger.info("User logged out: " + req.session.user.username);
		req.session.destroy();
		res.json({success: true, message: "Login Successful. Cookie set."});
	});
};