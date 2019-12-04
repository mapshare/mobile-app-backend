const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationImage = require('./locationImage');
const Review = require('./review');

// create Location Schema & model
const LocationSchema = new Schema({
  locationAddress: {
    type: String,
    required: [true, 'locationAddress (string) is required']
  },
  loactionPriceRange: {
    type: Number,
    required: [true, 'priceRange (0, 1, 2, 3) is required']
  },
  additionalInformation: {
    type: String
  },
  locationImageSet: [LocationImage],
  locationReviewSet: [Review]
});

//const Location = mongoose.model("location", LocationSchema);
module.exports = LocationSchema;
