const path = require('path');
const { credentialsAreValid, sessionIsValid, userInGame} = require('../middleware/auth');
const { logger } = require('../middleware/serverLogger');
const Counter = require('../models/counter.model');
const Game = require('../models/game.model');
const User = require('../models/user.model');
const { getLegalJumps } = require('../utils/jumps')

module.exports = function(app) {
    // add routes to send static files in response to get requests
    app.get('/game/room/:id', sessionIsValid, userInGame, (req, res) => {
        // Log user details to console
        logger.info("User " + req.session.user.username + " visited the game page : " + req.params.id);
        req.session.user.lastVisitedGame = {
            id: req.params.id,
            time: Date.now()
        };
        req.session.save();
        Game.findOne({gameId: req.params.id}, (err, game) => {
            if (err) {
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            }
            if (game == null) {
                res.json({success: false, message: "An error occurred"});
            } else if (game.gameStatus == "finished") {
                res.render('successRedirect',{
                    data: {
                        message: "This game has already finished. The winner was: " + game.winner, 
                        redirectUrl: "/lobby"
                    }});
                // TODO: replace with a redirect to the game history page
            } else if (game.gameStatus == "abandoned") {
                res.render('successRedirect',{data: {message: "This game has been abandoned. The winner was: " + game.winner, redirectUrl: "/lobby"}});
                // TODO: replace with a redirect to the game history page
            } else {
                res.render('game', {
                    userData: {user: req.session.user},
                    gameData: {
                        gameId: game.gameId,
                        player1Username: "@" + game.player1Username,
                        player2Username: "@" + game.player2Username,
                        blackTokens: game.blackTokens,
                        ballPosition: game.ballPosition,
                        possibleJumps: game.possibleJumps,
                        turn: "@" + game.turn,
                        gameStatus: game.gameStatus,
                        winner: "@" + game.winner
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
        if (req.body.opponent.charAt(0) == '@') {
            req.body.opponent = req.body.opponent.substring(1);
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
                        gameId: counter.seq,
                        possibleJumps: []
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

    app.post('/game/placeBlack', sessionIsValid, userInGame, (req, res) => {
        // req.body: {x, y, turn, gameId}
        // game is not won yet
        // game status is inProgress
        // turn is the current user's turn
        // x and y are inside the board, x and y are integers
        // x and y are not occupied by a black token
        // x and y are not occupied by the ball

        Game.findOne({gameId: req.body.gameId}, (err, game) => {
            if (err) {
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            }
            if (game == null) {
                res.json({success: false, message: "An error occurred"});
            } else {
                if (game.winner != null) {
                    res.json({success: false, message: "The game is over"});
                } else if (game.gameStatus != "inProgress") {
                    res.json({success: false, message: "The game is over"});
                } else if (game.turn != req.session.user.username) {
                    res.json({success: false, message: "It is not your turn"});
                } else if (req.body.x < 0 || req.body.x > 16 || req.body.y < 0 || req.body.y > 20) {
                    res.json({success: false, message: "Invalid coordinates"});
                } else if (game.blackTokens.some((token) => token.x == req.body.x && token.y == req.body.y)) {
                    res.json({success: false, message: "Invalid coordinates"});
                } else if (game.ballPosition.x == req.body.x && game.ballPosition.y == req.body.y) {
                    res.json({success: false, message: "Invalid coordinates"});
                } else {
                    game.blackTokens = [...game.blackTokens, {x: req.body.x, y: req.body.y}]
                    game.possibleJumps = getLegalJumps(game.ballPosition, [...game.blackTokens, {x: req.body.x, y: req.body.y}]);
                    game.turn = game.turn === game.player1Username ? game.player2Username : game.player1Username;
                    game.save((err) => {
                        if (err) {
                            console.log(err);
                            res.json({success: false, message: "An error occurred", error: err});
                        } else {
                            res.json({success: true});
                        }
                    });
                }
            }
        });
    });

    app.post('/game/performJump', sessionIsValid, userInGame, (req, res) => {
        // req.body: {x, y, turn, gameId}
        // game is not won yet
        // game status is inProgress
        // turn is the current user's turn
        // x and y are inside the board, x and y are integers
        // x and y are not occupied by a black token
        // x and y are not occupied by the ball

        Game.findOne({gameId: req.body.gameId}, (err, game) => {
            if (err) {
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            }
            if (game == null) {
                res.json({success: false, message: "An error occurred"});
            } else {
                if (game.winner != null) {
                    res.json({success: false, message: "The game is over"});
                } else if (game.gameStatus != "inProgress") {
                    res.json({success: false, message: "The game is over"});
                } else if (game.turn != req.session.user.username) {
                    res.json({success: false, message: "It is not your turn"});
                } else if (req.body.x < 0 || req.body.x > 16 || req.body.y < 0 || req.body.y > 20) {
                    res.json({success: false, message: "Invalid coordinates"});
                } else if (game.blackTokens.some((token) => token.x == req.body.x && token.y == req.body.y)) {
                    res.json({success: false, message: "Invalid coordinates"});
                } else if (game.ballPosition.x == req.body.x && game.ballPosition.y == req.body.y) {
                    res.json({success: false, message: "Invalid coordinates"});
                } else {
                    // check if {req.body.x, req.body.y} are in the possibleJumps[i].ballFinalPosition
                    var found = false;
                    var thisJump = -1;
                    for (var thisJump = 0; thisJump < game.possibleJumps.length; thisJump++) {
                        if (game.possibleJumps[thisJump].ballFinalPosition.x == req.body.x && game.possibleJumps[thisJump].ballFinalPosition.y == req.body.y) {
                            found = true;
                            break;
                        }
                    }
                    if(!found || thisJump == -1) {
                        res.json({success: false, message: "Invalid coordinates"});
                    } else {
                        game.ballPosition = {x: req.body.x, y: req.body.y};
                        game.blackTokens = game.blackTokens.filter((token) => {
                            for (var i = 0; i < game.possibleJumps[thisJump].willBeRemoved.length; i++) {
                                if (game.possibleJumps[thisJump].willBeRemoved[i].x == token.x && game.possibleJumps[thisJump].willBeRemoved[i].y == token.y) {
                                    return false;
                                }
                            }
                            return true;
                        });
                        game.possibleJumps = getLegalJumps(game.ballPosition, game.blackTokens.filter((token) => {
                            for (var i = 0; i < game.possibleJumps[thisJump].willBeRemoved.length; i++) {
                                if (game.possibleJumps[thisJump].willBeRemoved[i].x == token.x && game.possibleJumps[thisJump].willBeRemoved[i].y == token.y) {
                                    return false;
                                }
                            }
                            return true;
                        }));
                        game.turn = game.turn === game.player1Username ? game.player2Username : game.player1Username;
                        // check if ball is in the goal
                        if (game.ballPosition.y == 1 || game.ballPosition.y == 2) {
                            game.winner = game.player1Username;
                            game.gameStatus = "over";
                            // Update score of this player
                            User.findOneAndUpdate({username: game.player1Username}, {$inc: {score: 1}}, (err) => {
                                if (err) console.log(err);
                            });
                        } else if (game.ballPosition.y == 18 || game.ballPosition.y == 19) {
                            game.winner = game.player2Username;
                            game.gameStatus = "over";
                            User.findOneAndUpdate({username: game.player2Username}, {$inc: {score: 1}}, (err) => {
                                if (err) console.log(err);
                            });
                        }
                        game.save((err) => {
                            if (err) {
                                console.log(err);
                                res.json({success: false, message: "An error occurred", error: err});
                            } else if(game.winner != null) {
                                res.json({success: false, message: "Game Over! The winner of this game is: " + game.winner});
                            }
                        });
                    }
                }
            }
        });
    });
};