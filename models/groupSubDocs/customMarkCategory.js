const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Custom Mark Category Schema & model
const CustomMarkCategorySchema = new Schema({
    customMarkCategoryName: ""
});

//const CustomMarkCategory = mongoose.model('customMarkCategory', CustomMarkCategorySchema);
module.exports = CustomMarkCategorySchema;