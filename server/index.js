// Express.js server to echo back the request body
// tested with curl -X POST -d "hello world" http://localhost:3000

const express = require('express');
const server = express();

const cors = require("cors");
server.use(cors({origin: 'http://localhost:3000'}));
server.use(express.json());
server.use(express.static('frontend'));
server.use(express.urlencoded({ extended: true }));
require("dotenv").config();

const serverPort = process.env.CLIENT_PORT|| 3000;
revision = require('child_process').execSync('git rev-parse HEAD').toString().trim().slice(0, 7);
server.listen(serverPort, () => {
    console.log('Server Listening on port : ' + serverPort);
    console.log(`Commit Hash: ${revision}`);
});

// get route to test the server
server.get('/', (req, res) => {
    res.send(`Hello World from pf-server! Server Version : ${revision}\n`);
});

server.post('/', (req, res) => {
    res.send(req.body);
});

// import routes for authentication and user management
require('../routes/auth.routes')(server);
require('../routes/user.routes')(server);

// test db connection
// const dbConfig = require("../config/db.config");
const {DB_HOST} = process.env;

const db = require("../models");
const Role = db.role;

db.mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to MongoDB");
    initial();
}).catch(err => {
    console.error("Connection error", err);
    process.exit();
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) console.log("error", err);
                console.log("added 'user' to roles collection");
            });
    
            new Role({
                name: "moderator"
            }).save(err => {
                if (err) console.log("error", err);
                console.log("added 'moderator' to roles collection");
            });
    
            new Role({
                name: "admin"
            }).save(err => {
                if (err) console.log("error", err);
                console.log("added 'admin' to roles collection");
            });
        } else {
            console.log(count + " Roles already exist");
        }
    });
}