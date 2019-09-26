const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create User Event Schema & model
const UserEventSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    event: { type: Schema.Types.ObjectId, ref: "event" },
    userEventRole: { type: Schema.Types.ObjectId, ref: "eventRoles" },
})

const UserEvent = mongoose.model('userEvent', UserEventSchema);
module.exports = UserEvent;