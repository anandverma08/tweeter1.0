const express = require('express');
const bodyParser = require('body-parser');
const RoutesObj = require('./routes/posts')
const UserRoute = require('./routes/user')

const mongoose = require('mongoose');
const url = "mongodb+srv://Anand:"+ process.env.MONGO_ATLAS_PW +"@anandcluster.55x9y.mongodb.net/node-angular?retryWrites=true&w=majority"

const app = express();

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to server!")
  }).catch((err) => {
    console.log("Error in connecting", err);
  })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
  res.header('Access-Control-Allow-Credentials', true);
  return next();
})



app.use('/api/posts', RoutesObj);
app.use('/api/user',UserRoute);

module.exports = app;
