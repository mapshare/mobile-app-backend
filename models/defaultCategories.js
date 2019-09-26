const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Custom Categories Schema & model

const DefaultCategorisSchema = new Schema({
    categoryName: {
      type: String,
      required: [true, 'categoryName field is required']
    },
})

const dCategories = mongoose.model('dCategories', DefaultCategorisSchema);

module.exports = dCategories;