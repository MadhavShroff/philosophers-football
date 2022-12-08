const path = require('path');
const { checkSessionAndCredentials } = require('../middleware/auth');

module.exports = function(app) {
    // add routes to send static files in response to get requests
    app.get('/', (req, res) => {
        res.redirect('/login');
    });
    app.get('/game', checkSessionAndCredentials, (req, res) => {
        res.sendFile(path.resolve('..', '/frontend/game.html'));
    });
    app.get('/game.html', checkSessionAndCredentials, (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/game.html'), {root: path.join(__dirname, '../frontend')});
    });
    app.get('/login', (req, res) => {
        res.sendFile('login.html', {root: path.join(__dirname, '../frontend')});
    });
    app.get('/signup', (req, res) => {
        res.sendFile('signup.html', {root: path.join(__dirname, '../frontend')});
    });
    app.get('/lobby', checkSessionAndCredentials, (req, res) => {
        res.render('lobby', {data: {user: req.session.user}});
    });

    app.get('/profile', checkSessionAndCredentials, (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/profile.html'), {root: path.join(__dirname, '../frontend')});
    });
    app.get('/leaderboard', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/leaderboard.html'), {root: path.join(__dirname, '../frontend')});
    });
};