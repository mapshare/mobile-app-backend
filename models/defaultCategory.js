const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Default Category Schema & model
const DefaultCategorySchema = new Schema({
  defaultCategoryName: {
    type: String
  },
  isSelected: {
    type: Boolean
  },
  categoryColor: {
    type: String
  }
});

const DefaultCategory = mongoose.model(
  'defaultCategory',
  DefaultCategorySchema
);
module.exports = DefaultCategory;
