const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Location = require("./location");

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
  markName: {
    type: String
  },
  defaultMarkCategroy: {
    type: Schema.Types.ObjectId, ref: "defaultCategory"
  },
  customMarkCategroy: {
    type: Schema.Types.ObjectId, ref: "customMarkCategroy"
  },
  markLocations: Location,
  markCoordinates: {
    long: Number,
    lat: Number,
  },
  geometry: {
    type: GeoSchema,
    required: [true, "geoSchema required to save mark"]
  },
  groupMarkCreatedBy: { type: Schema.Types.ObjectId, ref: "groupMember" },
});

function checkCoordinates(array) {
  return array.length === 2
}

//const Mark = mongoose.model('mark', MarkSchema);
module.exports = MarkSchema;