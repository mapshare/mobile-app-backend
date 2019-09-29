const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create review Schema & model
const ReviewSchema = new Schema({
  reviewRating: {
    type: Number,
    required: [true, 'rating is required to save review']
  },
  reviewContent: {
    type: String,
    required: [true, 'content is required to save review']
  },
  reviewUpdatedAt: Date,
  reviewCreatedAt: Date,
});

//const Review = mongoose.model('review', ReviewSchema);
module.exports = ReviewSchema;