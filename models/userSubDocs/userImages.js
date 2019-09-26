const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create group Schema & model
const UserImageSchema = new Schema({
  userImageData: {
    type: Buffer
  },
  userImageContentType: {
    type: String
  },
  userImageTimeStamp: {
    type: Date,
    default: Date.now
  }
});

//const UserImage = mongoose.model("locationImage", UserImageSchema);
module.exports = UserImageSchema;