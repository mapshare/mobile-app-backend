const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create post Schema & model
const PostSchema = new Schema({
    PostTitle: {
        type: String,
        required: [true, 'Post title field is required']
    },
    PostContent: {
        type: String,
        required: [true, 'Post content field is required']
    },
    groupFeed: {
        type: Schema.Types.ObjectId,
        ref: "groupFeed",
        required: [true, 'Group Feed field is required']
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "user",
        required: [true, 'User field is required']
    }
})

const Post = mongoose.model('post', PostSchema);

module.exports = Post;