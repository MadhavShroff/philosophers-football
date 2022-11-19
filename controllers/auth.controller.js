const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        // bcryptjs hashes the password using a salt and returns the hash
        // The salt makes it impossible to generate the same hash from the same password
        // The salted hash is then stored in the database
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(11))
    });

    user.save((err, user) => {
        send500(res, err);
        if (req.body.roles) {
            Role.find({name: { $in: req.body.roles }}, (err, roles) => {
                send500(res, err);
                user.roles = roles.map(role => role._id);
                user.save(err => {
                    if(err) send500(res, err);
                    else res.send({ message: "User was registered successfully!" });
                });
            });
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                send500(res, err);
                user.roles = [role._id];
                user.save(err => {
                    if(err) send500(res, err);
                    else res.send({ message: "User was registered successfully!" });
                });
            });
        }
    });
};

function send500(res, err) {
    if(err) res.status(500).send({ message: err });
    return;
}

exports.signin = (req, res) => {
    User.findOne({username: req.body.username}).populate("roles", "-__v").exec((err, user) => {
        send500(res, err);
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
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400, // 24 hours
            algorithm: "RS256"
        });

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