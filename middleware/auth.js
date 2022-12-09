const bcrypt = require('bcryptjs');
const { logger } = require('../middleware/serverLogger');
const db = require("../models");
const User = db.user;

// middleware reads req body and checks if credentials are valid
// if valid, goto next middleware
// if invalid, redirect to login page
const credentialsAreValid = (req, res, next) => {
    User.findOne({
        username: req.body.username 
    }).then(user => {
        if (!user) { // if the user is not found, redirect to the login page
            logger.error("Invalid username: " + req.body.username);
            res.status(401).send({ message: "Invalid username" });
        } else if (bcrypt.compareSync(req.body.password, user.password)) { 
            req.session.user = {
                id: user.id, // ID is used to find the user in the database
                username: user.username,
                email: user.email
            }
            next(); // if the password is correct, create a new session and allow user through
        } else { 
            logger.error("Invalid password for user: " + user.username);
            res.status(401).send({ message: "Invalid password" });
        }
    })
}

const sessionIsValid = (req, res, next) => {
    if (req.session && req.session.user) {
        next(); // Valid Session, allow user through
    } else {
        // if the user is not found, redirect to the login page
        res.redirect('/login');
    }
}


const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).json({error: err});
            return;
        }
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }
        // Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).json({error: err});
                return;
            }
            if (user) {
                res.status(400).send({ message: "Failed! Email is already in use!" });
                return;
            }
            next();
        })
    })
}

module.exports = {
    credentialsAreValid,
    sessionIsValid,
    checkDuplicateUsernameOrEmail
}