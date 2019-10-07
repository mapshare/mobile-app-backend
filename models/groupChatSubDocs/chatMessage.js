const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create event Schema & model
const EventSchema = new Schema({
    messageBody: "",
    messageCreatedBy: { type: Schema.Types.ObjectId, ref: "groupMember" },
    messageCreatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = EventSchema;