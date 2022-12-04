const config = require("../config/auth.config");
const db = require("../models");
const {logger} = require('../middleware/serverLogger');
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    new User({
        username: req.body.username,
        email: req.body.email,
        // bcryptjs hashes the password using a salt and returns the hash
        // The salt makes it impossible to generate the same hash from the same password
        // The salted hash is then stored in the database
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(11))
    }).save((err, user) => {
        if(!err) logger.info("User created: " + user.username + " : " + user.email);
        else res.status(500).send({ message: err });
    });
};

function send500ifErr(res, err) {
    if(err) res.status(500).send({ message: err });
    return;
}

exports.signin = (req, res) => {
    User.findOne({username: req.body.username}).exec((err, user) => {
        send500ifErr(res, err);
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        
        // create a cookie with the user's id
        // the cookie will expire in 10 minutes (600000 milliseconds)
        // sameSite: true blocks CORS requests on cookies. This will affect the workflow on API calls and mobile applications.
        // secure requires HTTPS connections. 
        res

        var authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
            authorities.push(user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
    });
};