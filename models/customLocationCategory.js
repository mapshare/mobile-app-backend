const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Custom Location Category Schema & model
const CustomLocationCategorySchema = new Schema({
    customLocationCategoryName: ""
});

const CustomLocationCategory = mongoose.model('customLocationCategory', CustomLocationCategorySchema);
module.exports = CustomLocationCategory;