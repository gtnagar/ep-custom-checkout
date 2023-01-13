require('dotenv').config();

const express = require('express');

const app = express();
const { ...env } = process.env;

app.listen(env.PORT, () => {
    console.log('server listening on ', env.PORT);
});

app.get('/createStorefrontToken', (req, res) => {
    res.send('Hello World!');
});
