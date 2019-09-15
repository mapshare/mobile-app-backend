const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create group feed Schema & model
const GroupFeedSchema = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    ref: "group",
    required: [true, 'Group field is required']
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: "post",
    required: [true, 'Posts field is required']
  }]
})

const GroupFeed = mongoose.model('groupFeed', GroupFeedSchema);

module.exports = GroupFeed;