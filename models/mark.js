const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create GeoSchema for mark location
const GeoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
    required: [true, 'please provide coordinates of location'],
    validate: [checkCoordinates, '{PATH} must be of length 2: [lat, lng]']
  }
});

// create mark Schema & model
const MarkSchema = new Schema({
  locationId: {
    type: Schema.Types.ObjectId,
    required: [true, 'unique locationId is required to save user / OR USE _OID????']
  },
  markCoordinates: {
    long: Number,
    lat: Number,
  },
  // restaurantId: {
  //   type: String,
  //   //required: [true, 'corresponding restaurantId required for mark']
  // },
  geometry: {
    type: GeoSchema,
    required: [true, "geoSchema required to save mark"]
  },
  groupId: Schema.Types.ObjectId
})
// , {
//   toObject: {virtuals: true},
//   toJSON: {virtuals: true}
// })

function checkCoordinates(array) {
  return array.length === 2
}

const Mark = mongoose.model('mark', MarkSchema);

module.exports = Mark;