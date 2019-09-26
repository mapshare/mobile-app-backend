const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Custom Categories Schema & model

const CustomCategorisSchema = new Schema({
    categoryName: {
      type: String,
      required: [true, 'categoryName field is required']
    },
})

const cCategories = mongoose.model('cCategories', CustomCategorisSchema);

module.exports = cCategories;