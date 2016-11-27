'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
//---------------------------
const request = require('request')
//---------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
//---------------------------
app.use(bodyParser.urlencoded({extended: false}))

//---------------------------
app.get('/', function(req, res) {
    res.render('index', {
        appToken: process.env.SMOOCH_APP_TOKEN

    });
});

module.exports = app;
