const path = require('path');
const { credentialsAreValid, sessionIsValid } = require('../middleware/auth');
const { logger } = require('../middleware/serverLogger');
const Game = require('../models/game.model');
const User = require('../models/user.model');

module.exports = function(app) {
    // add routes to send static files in response to get requests
    app.get('/', sessionIsValid, (req, res) => {
        // Log user details to console
        res.redirect('/lobby');
    });
    app.get('/login', (req, res) => {
        res.render('login', {data: {user: req.session.user, csrfToken: req.session.csrfSecret}});
    });
    app.get('/signup', (req, res) => {
        logger.info("csrfToken: " + req.session.csrfSecret);
        res.render('signup', {data: {user: req.session.user, csrfToken: req.session.csrfSecret}});
    });
    app.get('/lobby', sessionIsValid, (req, res) => {
        logger.info("User " + req.session.user.username + " visited the lobby");
        Game.find({$or: [{player1: req.session.user.id}, {player2: req.session.user.id}]}, (err, games) => {
            if (err) {
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            }
            if (games == null) {
                res.json({success: false, message: "An error occurred"});
            } else {
                // get list of all usernames
                User.find({}, (err, users) => {
                    if (err) {
                        console.log(err);
                        res.json({success: false, message: "An error occurred"});
                    }
                    if (users == null) {
                        res.json({success: false, message: "An error occurred"});
                    } else {
                        res.render('lobby', 
                        {   
                            data: {
                            user: req.session.user, 
                            games: games.map((game) => {
                                return {
                                    gameId: game.gameId,
                                    player1Username: "@" + game.player1Username,
                                    player2Username: "@" + game.player2Username,
                                    gameStatus: game.gameStatus,
                                    winner: game.winner
                                }
                            }),
                            users: users.map((user) => {
                                return {
                                    username: "@" + user.username,
                                    score: user.score
                                }
                            })
                        }});
                    }
                });
            }
        });
    });
};