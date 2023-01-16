/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
require('dotenv').config();

const axios = require('axios')
const express = require('express');

const app = express();
const { ...env } = process.env;

const config = {
    baseURL: 'https://api.bigcommerce.com/stores/kr9c3dz9mi/v3/storefront/api-token',
    headers: {
        'X-Auth-Token': env.ACCESS_TOKEN,
        'Content-Type': "application/json",
        'Accept' : 'application/json'
    }
};


app.use(express.json())

app.listen(env.PORT, () => {
    console.log('server listening on ', env.PORT);
});

app.get('/token', async (req, res) => {
    const today = new Date()
    const expiryDate = new Date(today)
    expiryDate.setMinutes(today.getMinutes() + 5)
    const timestamp = Math.floor(expiryDate.getTime() / 1000)
    const api = axios.create(config);

    api.post("", {
        "allowed_cors_origins": [
            "https://localhost:8080"
        ],
        "channel_id": 1,
        "expires_at": timestamp
    })
        .then((response) => {

            console.log(response)
            res.send(response.data)
        })
        .catch((err) => {

            console.log(err)
            res.send(err)
        })

});


app.delete('/token',(req, res) => {

    console.log(req.body)
    config.headers["Sf-Api-Token"] = req.body.token

    const api = axios.create(config);
    
    api.delete()
    .then((response)=>{
        console.log(response)
        res.send(response.data)
    })
    .catch((err)=>{
        console.log(err)
        res.send(err)
    })

});

