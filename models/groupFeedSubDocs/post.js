const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create post Schema & model
const PostSchema = new Schema({
    postTitle: {
        type: String,
        required: [true, 'Post title field is required']
    },
    postContent: {
        type: String,
        required: [true, 'Post content field is required']
    },
    postCreatedBy: {
        type: Schema.Types.ObjectId,
        ref: "groupMember",
        required: [true, 'User field is required']
    },
    postDefaultCategory: { type: Schema.Types.ObjectId, ref: "defaultPostCategory" },
    postCustomCategory: { type: Schema.Types.ObjectId, ref: "user.customPostCategory" },
})

//const Post = mongoose.model('post', PostSchema);
module.exports = PostSchema;