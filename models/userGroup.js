const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create User Group Schema & model
const UserGroupSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    group: { type: Schema.Types.ObjectId, ref: "group" },
    userGroupRole: { type: Schema.Types.ObjectId, ref: "groupRoles" },
})

const UserGroup = mongoose.model('userGroup', UserGroupSchema);
module.exports = UserGroup;