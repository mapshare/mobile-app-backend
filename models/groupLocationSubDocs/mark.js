const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create GeoSchema for mark location
const GeoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number, Number],
    index: '2d',
    required: [true, 'please provide coordinates of location'],
    validate: [checkCoordinates, '{PATH} must be of length 2: [lat, lng]']
  }
});

// create mark Schema & model
const MarkSchema = new Schema({
  markCoordinates: {
    long: Number,
    lat: Number,
  },
  geometry: {
    type: GeoSchema,
    required: [true, "geoSchema required to save mark"]
  }
});

function checkCoordinates(array) {
  return array.length === 2
}

//const Mark = mongoose.model('mark', MarkSchema);
module.exports = MarkSchema;