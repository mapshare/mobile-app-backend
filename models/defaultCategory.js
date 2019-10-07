const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Default Category Schema & model
const DefaultCategorySchema = new Schema({
    defaultCategoryName: ""
});

const DefaultCategory = mongoose.model('defaultCategory', DefaultCategorySchema);
module.exports = DefaultCategory;