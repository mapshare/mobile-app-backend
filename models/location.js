const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Mark = require("./mark");
const LocationImage = require("./locationImage");

// create Location Schema & model
const LocationSchema = new Schema({
  locationName: {
    type: String,
    required: [true, "locationName field is required"]
  },
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
    { LocationImage }
  ],
  locationDefaultCategory: { type: Schema.Types.ObjectId, ref: "defaultLocationCategory" },
  locationCustomCategory: { type: Schema.Types.ObjectId, ref: "user.customLocationCategory" },
  locationReviewSet: [
    { type: Schema.Types.ObjectId, ref: "user.review" }
  ],
  locationMark: [
    { Mark }
  ],
  locationCreatedBy: { type: Schema.Types.ObjectId, ref: "user" }
});

const Location = mongoose.model("location", LocationSchema);
module.exports = Location;