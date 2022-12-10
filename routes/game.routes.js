const path = require('path');
const { credentialsAreValid, sessionIsValid, userInGame} = require('../middleware/auth');
const { logger } = require('../middleware/serverLogger');
const Counter = require('../models/counter.model');
const Game = require('../models/game.model');
const User = require('../models/user.model');

module.exports = function(app) {
    // add routes to send static files in response to get requests
    app.get('/game/room/:id', sessionIsValid, userInGame, (req, res) => {
        console.log(JSON.stringify(req.session));
        // Log user details to console
        logger.info("User " + req.session.user.username + " visited the game page : " + req.params.id);
        req.session.user.lastVisitedGame = {
            id: req.params.id,
            time: Date.now()
        };
        Game.findOne({gameId: req.params.id}, (err, game) => {
            if (err) {
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            }
            if (game == null) {
                res.json({success: false, message: "An error occurred"});
            } else {
                res.render('game', {
                    data: {user: req.session.user},
                    gameData: {
                        gameId: game.gameId,
                        player1Username: "@" + game.player1Username,
                        player2Username: "@" + game.player2Username,
                        blackTokens: game.blackTokens,
                        ballPosition: game.ballPosition,
                        turn: "@" + game.turn,
                        gameStatus: game.gameStatus,
                        winner: game.winner
                    }
                });
            }
        });
    });

    app.post('/game/createGame', sessionIsValid, (req, res) => {
        // Check if a user with the given username exists
        // check if entered username is the same as the current user's username
        if (req.body.opponent == req.session.user.username) {
            res.json({success: false, message: "You cannot play against yourself"});
            return;
        }
        User.findOne({username: req.body.opponent}, (err, user) => {
            if (err) {
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            }
            if (user == null) {
                res.json({success: false, message: "No user with the given username exists"});
            } else {
                var ctr = -1;
                Counter.findOneAndUpdate({}, {$inc: { seq: 1} }, function(error, counter) {
                    if(error) {
                        res.json({success: false, message: "An error occurred"});
                        logger.error(error);
                    }
                    Game.create({
                        player1: req.session.user.id,
                        player2: user.id,
                        player1Username: req.session.user.username,
                        player2Username: user.username,
                        blackTokens: [],
                        ballPosition: {
                            x: 8, y: 10
                        },
                        turn: req.session.user.username,
                        gameStatus: "inProgress",
                        winner: null,
                        gameId: counter.seq
                    }).then((game) => {
                        res.json({success: true, gameId: game.gameId});
                    }).catch((err) => {
                        console.log(err);
                        res.json({success: false, message: "An error occurred"});
                    });
                });
            }
        });
        logger.info("Game room created. Players: " + req.session.user.username + " and " + req.body.opponent);
    });
};