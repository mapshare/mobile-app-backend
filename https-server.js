require('dotenv').config();
const HTTPS_PORT = process.env.HTTPS_PORT
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MONGO_URL = require('./mongoURL');

var https = require('https');

var fs = require('fs');

var hostname = '0.0.0.0'


var https_options = {

  cert: fs.readFileSync("/root/cert/prj666-2021.crt"),

  ca: fs.readFileSync('/root/cert/RapidSSL_RSA_CA_2018.crt'),

  key: fs.readFileSync("/root/cert/prj666-2021.key"),


};

// listen for requests 

const httpsServer = https.createServer(https_options, function (req, res) {

    console.log('Now listening for HTTPS requests')
  
  });
  
httpsServer.listen(HTTPS_PORT, hostname);

//set up express app
const app = express();

// body parsing middleware
app.use(bodyParser.json())

// allow CORS
app.use(cors())


// prevent 304 error
app.use(express.static(__dirname + '/static'));

// error handling middleware
app.use((err, req, res, next) => {
  res.status(422).send({ error: err })
});

// setup socket io
var io = require('socket.io')(httpsServer);

// require routes and pass io to them
const routes = require('./routes/index.js')(io);

// initialize routes
app.use('/api', routes);

// connect to mongodb and initialize data
const initialData = require('./initialData')(io);

mongoose.connect(MONGO_URL, { useNewUrlParser: true }).then(() => {
  console.log("connected to mongoDB")
  initialData.initialData();
}).catch(err => {
  console.log("ERRORS: ", err);
  console.log("MONGODB CONNECTION FAILED.")
  // process.exit();
});
