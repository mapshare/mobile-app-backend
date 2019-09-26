const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Custom Post Category Schema & model
const CustomPostCategorySchema = new Schema({
    customPostCategoryName: ""
});

//const CustomPostCategory = mongoose.model('customPostCategory', CustomPostCategorySchema);
module.exports = CustomPostCategorySchema;