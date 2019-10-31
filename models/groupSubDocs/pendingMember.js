const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Pending Member Schema & model
const PendingMemberSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "user", required: [true, 'user field is required'] },
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
});

module.exports = PendingMemberSchema;