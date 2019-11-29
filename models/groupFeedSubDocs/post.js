const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create post Schema & model
const PostSchema = new Schema({
    postImage: {
        data: Buffer, 
        contentType: String,
    },
    postCaption: {
        type: String,
    },
    postCreatedBy: {
        type: Schema.Types.ObjectId,
        ref: "groupMember",
    },
    postCreatedAt: {
        type: Date,
        default: Date.now
    }
})

//const Post = mongoose.model('post', PostSchema);
module.exports = PostSchema;