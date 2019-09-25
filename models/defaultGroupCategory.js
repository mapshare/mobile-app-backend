const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Default Group Category Schema & model
const DefaultGroupCategorySchema = new Schema({
    defaultGroupCategoryName: ""
});

const DefaultGroupCategory = mongoose.model('defaultGroupCategory', DefaultGroupCategorySchema);
module.exports = DefaultGroupCategory;