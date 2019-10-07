const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("./groupFeedSubDocs/post");

// create group feed Schema & model
const GroupFeedSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: "group" },
  groupPosts: [
    Post
  ],
});

const GroupFeed = mongoose.model('groupFeed', GroupFeedSchema);
module.exports = GroupFeed;