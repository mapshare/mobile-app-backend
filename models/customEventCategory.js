const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Custom Event Category Schema & model
const CustomEventCategorySchema = new Schema({
    customEventCategoryName: ""
});

const CustomEventCategory = mongoose.model('customEventCategory', CustomEventCategorySchema);
module.exports = CustomEventCategory;