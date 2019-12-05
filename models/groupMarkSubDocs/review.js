const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create review Schema & model
const ReviewSchema = new Schema({
  reviewContent: {
    type: String,
    required: [true, 'content is required to save review']
  },
  reviewCreatedBy: {
    type: Schema.Types.ObjectId,
    ref: "groupMember",
  },
  reviewCreatedAt: {
    type: Number,
    default: Date.now()
  }
});

//const Review = mongoose.model('review', ReviewSchema);
module.exports = ReviewSchema;