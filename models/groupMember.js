const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// create Group Member Schema & model
const GroupMemberSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: [true, 'user field is required'] },
    group: { type: Schema.Types.ObjectId, ref: "group", required: [true, 'group field is required'] },
    groupMemberRole: { type: Schema.Types.ObjectId, ref: "groupRoles", required: [true, 'groupRoles field is required'] },
    groupMemberPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }],
    groupMemberEvent: [{
        type: Schema.Types.ObjectId,
        ref: 'event'
    }],
    groupMemberMarks: [{
        type: Schema.Types.ObjectId,
        ref: 'mark'
    }],
    groupMemberReviews: [{
        type: Schema.Types.ObjectId,
        ref: "review"
    }]
});


const GroupMember = mongoose.model('groupMember', GroupMemberSchema);
module.exports = GroupMember;