const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create group roles Schema & model
const GroupRolesSchema = new Schema({
    groupRoleName: "",
    groupRolePermisionLevel: {
        type: Number
    }
})

const GroupRoles = mongoose.model('groupRoles', GroupRolesSchema);
module.exports = GroupRoles;