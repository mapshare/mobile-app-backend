const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create event Schema & model
const EventSchema = new Schema({
    eventName: "",
    eventDescription: "",
    eventMembers: [{ type: Schema.Types.ObjectId, ref: "groupMember" }],
    eventMark: { type: Schema.Types.ObjectId, ref: "mark" }
})

module.exports = EventSchema;