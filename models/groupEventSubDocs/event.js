const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create event Schema & model
const EventSchema = new Schema({
    eventName: "",
    eventDescription: "",
    eventUsers: [{ type: Schema.Types.ObjectId, ref: "userEvent" }],
    eventMark: { type: Schema.Types.ObjectId, ref: "mark" },
    eventDefaultCategory: { type: Schema.Types.ObjectId, ref: "defaultEventCategory" },
    eventCustomCategory: { type: Schema.Types.ObjectId, ref: "user.customEventCategory" },
})

module.exports = EventSchema;