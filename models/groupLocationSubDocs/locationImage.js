const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create group Schema & model
const LocationImageSchema = new Schema({
  LocationImageData: {
    type: Buffer
  },
  LocationImageContentType: {
    type: String
  },
  timeStamp: {
    type: Date,
    default: Date.now
  }
});

//const LocationImage = mongoose.model("locationImage", LocationImageSchema);
module.exports = LocationImageSchema;