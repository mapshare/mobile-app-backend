const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create group Schema & model
const LocationImageSchema = new Schema({
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "location",
    required: [true, "LocationId field is required"]
  },
  locationImageSet: [
    {
      locationImageId: {
        type: Schema.Types.ObjectId,
        required: [true, "LocationImageId field is required"]
      },
      fileName: {
        type: String
      },
      timeStamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const LocationImage = mongoose.model("locationImage", LocationImageSchema);

module.exports = LocationImage;
