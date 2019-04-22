const HTTP_PORT = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require('./routes/api');
const MONGO_URL = require('./mongoURL');

//set up express app
const app = express();

// connect to mongodb
mongoose.connect(MONGO_URL, { useNewUrlParser: true }).then(() => {
  console.log("connected to mongoDB")
}).catch(err => {
  console.log("ERRORS: ",err);
  console.log("MONGODB CONNECTION FAILED.")
  // process.exit();
});

// body parsing middleware
app.use(bodyParser.json())

// allow CORS
app.use(cors())

// initialize routes
app.use('/api', routes);

// prevent 304 error
app.use(express.static(__dirname + '/static'));

// error handling middleware
app.use((err, req, res, next) => {
  res.status(422).send({error: err})
});

// listen for requests
app.listen(HTTP_PORT, () => {
  console.log('now listening for requests')
});