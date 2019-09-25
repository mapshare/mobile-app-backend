const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Default Event Category Schema & model
const DefaultEventCategorySchema = new Schema({
    defaultEventCategoryName: ""
});

const DefaultEventCategory = mongoose.model('defaultEventCategory', DefaultEventCategorySchema);
module.exports = DefaultEventCategory;