const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create post Schema & model
const PostSchema = new Schema({
    postImage: {
        data: Buffer, 
        contentType: String,
        required: [true, 'Post Image field is required']
    },
    postCaption: {
        type: String,
        required: [true, 'Post caption field is required']
    },
    postCreatedBy: {
        type: Schema.Types.ObjectId,
        ref: "groupMember",
        required: [true, 'Member field is required']
    }
})

//const Post = mongoose.model('post', PostSchema);
module.exports = PostSchema;