const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Mark = require("./groupMarkSubDocs/mark");

// create group location Schema & model
const GroupMarkSchema = new Schema({
    group: { type: Schema.Types.ObjectId, ref: "group" },
    groupMarks: [
        Mark
    ],
});


const GroupMark = mongoose.model('GroupMark', GroupMarkSchema);
module.exports = GroupMark;