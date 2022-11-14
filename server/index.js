// Express.js server to echo back the request body
// tested with curl -X POST -d "hello world" http://localhost:3000

const express = require('express');
const server = express();
const frontend = express();

server.use(express.json());

const serverPort = process.env.SERVER_PORT || 8080;
const clientPort = process.env.CLIENT_PORT|| 3000;

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

// create another app to serve the frontend 

frontend.use(express.static('frontend'));
frontend.listen(clientPort, () => {
    // serve the frontend folder on port 3000
    console.log('Serving frontend on port 3000');
});

// frontend app will be served on port 3000
// server app will be served on port 8080