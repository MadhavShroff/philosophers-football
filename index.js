// Express.js server to echo back the request body
// tested with curl -X POST -d "hello world" http://localhost:3000

const express = require('express');
const app = express();

app.use(express.json());

app.post('/', (req, res) => {
    res.send(req.body);
});

app.listen(3000, () => console.log('Listening on port 3000'));