const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LocationImage = require("./locationImage");

// create Location Schema & model
const LocationSchema = new Schema({
  locationAddress: {
    type: String,
    required: [true, "locationAddress (string) is required"]
  },
  loactionPriceRange: {
    type: Number,
    required: [true, "priceRange (0, 1, 2) is required"],
  },
  additionalInformation: {
    type: String
  },
  locationImageSet: [
    LocationImage
  ],
  locationReviewSet: [
    { type: Schema.Types.ObjectId, ref: "user.review" }
  ]
});

//const Location = mongoose.model("location", LocationSchema);
module.exports = LocationSchema;