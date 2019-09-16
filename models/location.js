const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Location Schema & model
const LocationSchema = new Schema({
  locationId: {
    type: Schema.Types.ObjectId,
    required: [true, "locationId is required to save Location"]
  },
  // groupId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "group",
  //   required: [true, "groupId required to save Location"]
  // },
  locationName: {
    type: String,
    required: [true, "locationName field is required"]
  },
  locationAddress: {
    type: String,
    required: [true, "locationAddress (string) is required"]
  },
  priceRange: {
    type: String,
    required: [true, "priceRange ($, $$, $$$) is required"],
    validate: {
      validator: function(v) {
        if (
          v.split("").some(char => {
            return char !== "$";
          }) ||
          ![1, 2, 3].includes(v.length)
        ) {
          return false;
        }
        return true;
      },
      message: props => `${props.value} is not a valid price range!`
    }
  },
  locationReviewSet: [
    {
      type: Schema.Types.ObjectId,
      ref: "review"
    }
  ]
});

const Location = mongoose.model("location", LocationSchema);

module.exports = Location;
