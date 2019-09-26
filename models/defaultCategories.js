const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Custom Categories Schema & model

const DefaultCategorisSchema = new Schema({
    defaultName: {
      type: String,
      required: [true, 'categoryName field is required']
    },
})

const dCategories = mongoose.model('cCategories', DefaultCategorisSchema);

module.exports = dCategories;