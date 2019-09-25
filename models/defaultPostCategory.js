const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Default Post Category Schema & model
const DefaultPostCategorySchema = new Schema({
    defaultPostCategoryName: ""
});

const DefaultPostCategory = mongoose.model('defaultPostCategory', DefaultPostCategorySchema);
module.exports = DefaultPostCategory;