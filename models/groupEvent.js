const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Event = require("./groupEventSubDocs/event");

// create group Event Schema & model
const GroupEventSchema = new Schema({
    group: { type: Schema.Types.ObjectId, ref: "group" },
    groupEvents: [
        Event
    ],
});


const GroupEvent = mongoose.model('groupEvents', GroupEventSchema);
module.exports = GroupEvent;