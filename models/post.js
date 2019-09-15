const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create group Schema & model
const GroupSchema = new Schema({
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

GroupSchema.virtual('groupId').get(function () { return this._id; });

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;