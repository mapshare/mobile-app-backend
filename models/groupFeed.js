const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create group feed Schema & model
const GroupFeedSchema = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "group",
    required: [true, 'Group field is required']
  },
  postsId: [{
    type: Schema.Types.ObjectId,
    ref: "post"
  }]
})

const GroupFeed = mongoose.model('groupFeed', GroupFeedSchema);

module.exports = GroupFeed;