const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Location = require("./groupLocationSubDocs/location");

// create group location Schema & model
const GroupLocationSchema = new Schema({
    group: { type: Schema.Types.ObjectId, ref: "group" },
    groupLocations: [
        { Location }
    ],
});


const GroupLocation = mongoose.model('GroupLocation', GroupLocationSchema);
module.exports = GroupLocation;