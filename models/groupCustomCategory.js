const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const customCategory = require('./groupSubDocs/customMarkCategory');

// create group location Schema & model
const groupCustomCategorySchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: 'group' },
  groupCustomCategories: [customCategory]
});

const GroupCustomCategory = mongoose.model(
  'groupCustomCategory',
  groupCustomCategorySchema
);
module.exports = GroupCustomCategory;
