/*jshint esversion:6*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

if(process.env.NODE_ENV !== 'test'){
  mongoose.connect('mongodb://localhost/muber', {useMongoClient: true});

}

const app = express();

/*  ROUTES  */
const index = require('./controllers/index');
const api = require('./controllers/api');
/*
*/

app.use(bodyParser.json());



app.use('/', index);
app.use('/api', api);

//error handling middleware
app.use((err,req,res,next)=>{
  res.status(400).send({ error: err.message });
});

module.exports = app;
