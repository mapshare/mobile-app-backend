const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CustomMarkCategory = require("./groupSubDocs/customMarkCategory");
const PendingMember = require("./groupSubDocs/pendingMember");

// create group Schema & model
const GroupSchema = new Schema({
  groupName: {
    type: String,
    required: [true, 'groupName field is required']
  },
  groupDescription: {
    type: String,
  },
  groupImg: { data: Buffer, contentType: String },
  groupMarks: { type: Schema.Types.ObjectId, ref: "groupMarks" },
  groupMembers: [{ type: Schema.Types.ObjectId, ref: "groupMember" }],
  groupFeed: { type: Schema.Types.ObjectId, ref: "groupFeed" },
  groupEvents: { type: Schema.Types.ObjectId, ref: "groupEvents" },
  groupChat: { type: Schema.Types.ObjectId, ref: "groupChat" },
  groupDefaultCategory: [{ type: Schema.Types.ObjectId, ref: "defaultCategory" }],
  groupCustomMarkCategory: [CustomMarkCategory],
  groupPendingMembers: [PendingMember],
  groupCreatedBy: { type: Schema.Types.ObjectId, ref: "user", required: [true, 'user field is required'] },
  groupIsPublic: { type: Boolean, default: false },
  groupBanedUsers: [{ type: Schema.Types.ObjectId, ref: "user" }]
});

GroupSchema.virtual('groupId').get(function () { return this._id; });

GroupSchema.index({ groupName: 'text' });

const Group = mongoose.model('group', GroupSchema);
module.exports = Group;