const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Event = require("./event");

// create group Event Schema & model
const GroupEventSchema = new Schema({
    group: { type: Schema.Types.ObjectId, ref: "group" },
    GroupEvents: [
        { Event }
    ],
});


const GroupEvent = mongoose.model('GroupEvent', GroupEventSchema);
module.exports = GroupEvent;