// Express.js server to echo back the request body
// tested with curl -X POST -d "hello world" http://localhost:3000

const express = require('express');
const app = express();

app.use(express.json());

app.post('/', (req, res) => {
    res.send(req.body);
});

// get route to test the server
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.out('Listening on port 3000')
    revision = require('child_process').execSync('git rev-parse HEAD').toString().trim().slice(0, 7);
    console.out(`Commit Hash: ${revision}`);
});