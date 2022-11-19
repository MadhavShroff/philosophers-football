const express = require('express');
const cors = require("cors");
const {serverLogger, logger} = require('../middleware/serverLogger');
const cookieParser = require('cookie-parser')
const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim().slice(0, 7);
require("dotenv").config();

// Create a new Server
const server = express();

// Initialize Middleware
server.use(cookieParser());
server.use(serverLogger);
server.use(cors({origin: 'http://localhost:3000'}));
server.use(express.json());
server.use(express.static('frontend'));
server.use(express.urlencoded({ extended: true }));

const serverPort = process.env.CLIENT_PORT|| 3000;
server.listen(serverPort, () => {
    logger.info('Server Listening on port : ' + serverPort);
    logger.info(`Commit Hash: ${commitHash}`);
});

// import routes for authentication and user management
require('../routes/auth.routes')(server);
require('../routes/user.routes')(server);

// adhoc log to check if server is running
// log that server is running using winston

// test db connection
// const dbConfig = require("../config/db.config");
const {DB_HOST} = process.env;

const db = require("../models");
const Role = db.role;

db.mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info("Successfully connected to MongoDB");
    createRoles();
}).catch(err => {
    logger.error("Connection error", err);
    process.exit();
});

function createRoles() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) logger.error("error", err);
                logger.info("added 'user' to roles collection");
            });
            new Role({
                name: "moderator"
            }).save(err => {
                if (err) logger.error("error", err);
                logger.info("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) logger.error("error", err);
                logger.info("added 'admin' to roles collection");
            });
        } else if (!count) {
            logger.error("Error creating/retreiving roles");
            logger.error(err);
        } else {
            logger.error(count + " Roles already exist");
        }
    });
}