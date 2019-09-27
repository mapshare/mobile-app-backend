const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CustomMarkCategory = require("./groupSubDocs/customMarkCategory");

// create group Schema & model
const GroupSchema = new Schema({
  groupName: {
    type: String,
    required: [true, 'groupName field is required']
  },
  groupLocation: { type: Schema.Types.ObjectId, ref: "groupLocation" },
  groupMembers: [{ type: Schema.Types.ObjectId, ref: "userGroup" }],
  groupFeed: { type: Schema.Types.ObjectId, ref: "groupFeed" },
  groupEvents: { type: Schema.Types.ObjectId, ref: "groupEvents" },
  groupDefaultCategory: [{ type: Schema.Types.ObjectId, ref: "defaultGroupCategory" }],
  groupCustomMarkCategory: [CustomMarkCategory]
});

GroupSchema.virtual('groupId').get(function () { return this._id; });

const Group = mongoose.model('group', GroupSchema);
module.exports = Group;