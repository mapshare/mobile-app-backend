const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Unverified User Schema & model
const UnverifiedUserSchema = new Schema({
    unverifiedUserEmail: {
    type: String,
    unique: true,
    required: [true, 'Unverified user email is required']
  },
  unverifiedUserFirstName: {
    type: String,
    required: [true, 'Unverified user firstName is required']
  },
  unverifiedUserLastName: {
    type: String,
    required: [true, 'Unverified user lastName is required']
  }
});

const UnverifiedUser = mongoose.model('unverifiedUser', UnverifiedUserSchema);

module.exports = UnverifiedUser;