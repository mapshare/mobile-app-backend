const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Custom Group Category Schema & model
const CustomGroupCategorySchema = new Schema({
    customGroupCategoryName: ""
});

const CustomGroupCategory = mongoose.model('customGroupCategory', CustomGroupCategorySchema);
module.exports = CustomGroupCategory;