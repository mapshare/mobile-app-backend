const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserImages = require("./userSubDocs/userImages");

// create user Schema & model
const UserSchema = new Schema({
  userEmail: {
    type: String,
    unique: true,
    required: [true, "user email is required"]
  },
  userFirstName: {
    type: String,
    required: [true, "user firstName is required"]
  },
  userLastName: {
    type: String,
    required: [true, "user lastName is required"]
  },
  userPassword: {
    type: String,
    max: 1024,
    min: 6
  },
  googleId: {
    type: String,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid google id!`
    }
  },
  userProfilePic: {
    type: Schema.Types.ObjectId,
    ref: "userImages"
  },
  userImages: [UserImages],
  userGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "groupMember"
    }
  ]
});

UserSchema.virtual("userId").get(function() {
  return this._id;
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
