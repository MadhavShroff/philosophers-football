const path = require('path');

module.exports = function(app) {
    // add routes to send static files in response to get requests
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    });
    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/login.html'));
    });
    app.get('/signup', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/signup.html'));
    });
    app.get('/profile', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/profile.html'));
    });
    app.get('/leaderboard', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/leaderboard.html'));
    });
};