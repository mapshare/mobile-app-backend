const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserImages = require("./userSubDocs/userImages");
const Review = require("./userSubDocs/review");

// create user Schema & model
const UserSchema = new Schema({
  userEmail: {
    type: String,
    unique: true,
    required: [true, 'user email is required']
  },
  userFirstName: {
    type: String,
    required: [true, 'user firstName is required']
  },
  userLastName: {
    type: String,
    required: [true, 'user lastName is required']
  },
  googleId: {
    type: String,
    required: [true, 'must provide googleId field'],
    validate: {
      validator: function (v) {
        return /^\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid google id!`
    }
  },
  userProfilePic: [{
    type: Schema.Types.ObjectId,
    ref: 'userImages'
  }],
  userImages: [
    UserImages
  ],
  userReviews: [
    Review
  ],
  userGroup: [
    {
      type: Schema.Types.ObjectId,
      ref: 'userGroup'
    }
  ],
  userPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'post'
  }],
  userEvent: [{
    type: Schema.Types.ObjectId,
    ref: 'userEvent'
  }],
  userMarks: [{
    type: Schema.Types.ObjectId,
    ref: 'groupMark'
  }]
});

UserSchema.virtual('userId').get(function () { return this._id; });

const User = mongoose.model('user', UserSchema);

module.exports = User;