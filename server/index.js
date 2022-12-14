const express = require('express'); 
const session = require('express-session');
// use mongo store for session storage
const MongoStore = require('connect-mongo');
const {serverLogger, logger} = require('../middleware/serverLogger');
const cookieParser = require('cookie-parser')
const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim().slice(0, 7);
require("dotenv").config();
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true, value: req => req.cookies['XSRF-TOKEN']});

// Create a new Server
const server = express();
// Initialize Middleware
server.use(cookieParser());
server.use(serverLogger);
server.use(express.json());
server.use(express.static('frontend/js'));
server.use(express.static('frontend/css'));
server.use(express.static('frontend/static'));
server.use(express.urlencoded({ extended: true }));
server.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});
server.use(csrfProtection);
// xsrf error handler
server.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
     // handle CSRF token errors here
    res.status(403)
    console.log(req.cookies);
    res.send('session has expired or form tampered with')
})

server.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  next()
})

server.set("view engine", "ejs");

// if the Node app is behind a proxy (like Nginx, which it is), we will have to set proxy to true.
server.enable('trust proxy')
server.use(session({
    secret: process.env.SESSION_SECRET,
    name: "pfsession",
    proxy: process.env.PF_ENV === "production" ? true : false,
    cookie: {
        secure: process.env.PF_ENV === "production" ? true : false,
        maxAge: 600000,
    },
    store: MongoStore.create({
        mongoUrl: process.env.DB_HOST,
        ttl: 600000,
        collection: "userSessions",
        autoRemove: 'native', // Default
        expires: 1000 * 60 * 10 // 10 minutes
    }),
    saveUninitialized: false,
    rolling: true,
    resave: false,
}));


const serverPort = process.env.CLIENT_PORT|| 3000;
server.listen(serverPort, () => {
    logger.info('Server Listening on port : ' + serverPort);
    logger.info(`Commit Hash: ${commitHash}`);
});

// import routes for authentication and user management
require('../routes/auth.routes')(server);
require('../routes/pages.routes')(server);
require('../routes/game.routes')(server);

// adhoc log to check if server is running
// log that server is running using winston

// test db connection
// const dbConfig = require("../config/db.config");
const {DB_HOST} = process.env;

const db = require("../models/");
const User = db.user;

db.mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info("Successfully connected to MongoDB");
    // get users count from db
    getUserCount();
}).catch(err => {
    logger.error("Connection error", err);
    process.exit();
});

function getUserCount() {
    User.estimatedDocumentCount((err, count) => {
        if (!err) {
            logger.info("Number of users in db: " + count);
        } else {
            logger.error("Error getting user count: " + err);
        }
    });
}