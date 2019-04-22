const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create cuisine Schema & model
const CuisineSchema = new Schema({
  cuisineType: {
    type: String,
    required: [true, 'Name field is required']
  },
  cuisineList: [{
    type: String,
  }]
})

const Cuisine = mongoose.model('cuisine', CuisineSchema);

module.exports = Cuisine;