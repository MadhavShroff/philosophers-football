const path = require('path');
const { credentialsAreValid, sessionIsValid } = require('../middleware/auth');
const { logger } = require('../middleware/serverLogger');

module.exports = function(app) {
    // add routes to send static files in response to get requests
    app.get('/', sessionIsValid, (req, res) => {
        // Log user details to console
        res.redirect('/lobby');
    });
    app.get('/login', (req, res) => {
        res.sendFile('login.html', {root: path.join(__dirname, '../frontend')});
    });
    app.get('/signup', (req, res) => {
        res.sendFile('signup.html', {root: path.join(__dirname, '../frontend')});
    });
    app.get('/lobby', sessionIsValid, (req, res) => {
        logger.info("User " + req.session.user.username + " visited the lobby");
        res.render('lobby', {data: {user: req.session.user}});
    });

    app.get('/game/:id', sessionIsValid, (req, res) => {
        req.session.user.visitedGame = req.session.user.visitedGame == undefined ? 1 : req.session.user.visitedGame + 1;
        res.render('game', {data: {user: req.session.user}});
    });
    app.get('/game.html', sessionIsValid, (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/game.html'), {root: path.join(__dirname, '../frontend')});
    });
};