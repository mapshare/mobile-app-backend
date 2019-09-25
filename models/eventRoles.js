const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Event Roles Schema & model
const EventRolesSchema = new Schema({
    eventRoleName: "",
    eventRolePermisionLevel: {
        type: Number
    }
})

const EventRoles = mongoose.model('EventRoles', EventRolesSchema);
module.exports = EventRoles;