const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create priceRange Schema & model
const PriceRangeSchema = new Schema({
  priceRange:  {
    type: String,
    unique: true,
    required: [true, 'priceRange ($, $$, $$$) is required'],
    validate: { // take out this validation if already validated in dataService?
      validator: function(v) {
        if (v.split('').some(char => {return (char !== "$")}) || ![1,2,3].includes(v.length)) {
          return false
        }
        return true
        //return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid price range!`
    },
  },
  restaurantList: [{
    type: Schema.Types.ObjectId,
    ref: 'restaurant'
  }]
})

const PriceRange = mongoose.model('priceRange', PriceRangeSchema);

module.exports = PriceRange;