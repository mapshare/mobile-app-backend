const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create  Categories Schema & model
const CategoriesSchema = new Schema({
  defaultCategories: {
    type: String,
    required: [true, 'Name field is required']
  },
  customCategories: [{
    type: String,
    required: [true, 'Name field is required']
  }]
})

const Categories = mongoose.model('categories', CategoriesSchema);

module.exports = Categories;