const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Default Location Category Schema & model
const DefaultLocationCategorySchema = new Schema({
    defaultLocationCategoryName: ""
});

const DefaultLocationCategory = mongoose.model('defaultLocationCategory', DefaultLocationCategorySchema);
module.exports = DefaultLocationCategory;