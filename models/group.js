const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CustomMarkCategory = require("./groupSubDocs/customMarkCategory");

// create group Schema & model
const GroupSchema = new Schema({
  groupName: {
    type: String,
    required: [true, 'groupName field is required']
  },
  groupMarks: { type: Schema.Types.ObjectId, ref: "groupMarks" },
  groupMembers: [{ type: Schema.Types.ObjectId, ref: "groupMember" }],
  groupFeed: { type: Schema.Types.ObjectId, ref: "groupFeed" },
  groupEvents: { type: Schema.Types.ObjectId, ref: "groupEvents" },
  groupChat: { type: Schema.Types.ObjectId, ref: "groupChat" },
  groupDefaultCategory: [{ type: Schema.Types.ObjectId, ref: "defaultCategory" }],
  groupCustomMarkCategory: [CustomMarkCategory]
});

GroupSchema.virtual('groupId').get(function () { return this._id; });


const Group = mongoose.model('group', GroupSchema);
module.exports = Group;