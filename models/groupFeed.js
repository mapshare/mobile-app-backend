const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("./post");

// create group feed Schema & model
const GroupFeedSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: "group" },
  GroupPosts: [
    { Post }
  ],
});

const GroupFeed = mongoose.model('groupFeed', GroupFeedSchema);
module.exports = GroupFeed;