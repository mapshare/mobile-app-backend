const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create User Group Schema & model
const UserGroupSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: [true, 'user field is required'] },
    group: { type: Schema.Types.ObjectId, ref: "group", required: [true, 'group field is required'] },
    userGroupRole: { type: Schema.Types.ObjectId, ref: "groupRoles", required: [true, 'groupRoles field is required'] },
});


const UserGroup = mongoose.model('userGroup', UserGroupSchema);
module.exports = UserGroup;