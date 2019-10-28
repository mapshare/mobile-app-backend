require('dotenv').config();
const HTTP_PORT = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MONGO_URL = require('./mongoURL');

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

// listen for requests
var server = app.listen(HTTP_PORT, () => {
  console.log('now listening for requests')
});


// setup socket io
var io = require('socket.io')(server);

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