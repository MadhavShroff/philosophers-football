// Express.js server to echo back the request body
// tested with curl -X POST -d "hello world" http://localhost:3000

const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || '8080';
revision = require('child_process').execSync('git rev-parse HEAD').toString().trim().slice(0, 7);

app.listen(port, () => {
    console.log('Listening on port : ' + port);
    console.log(`Commit Hash: ${revision}`);
});

// get route to test the server
app.get('/', (req, res) => {
    res.send('Hello World from pf-server! `Server Version : ${revision}');
});

app.post('/', (req, res) => {
    res.send(req.body);
});