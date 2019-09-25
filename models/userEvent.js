const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventRoles = require("./eventRoles");

// create User Event Schema & model
const UserEventSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    event: { type: Schema.Types.ObjectId, ref: "event" },
    eventRoles: { EventRoles },
})

const UserEvent = mongoose.model('userEvent', UserEventSchema);
module.exports = UserEvent;