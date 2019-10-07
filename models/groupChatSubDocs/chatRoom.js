const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChatMessage = require("./chatMessage");

// create Chat Room Schema & model
const ChatRoomSchema = new Schema({
    chatRoomName: "",
    chatRoomMembers: [{ type: Schema.Types.ObjectId, ref: "groupMember" }],
    chatRoomMessage: [ChatMessage],
    chatRoomCreatedBy: { type: Schema.Types.ObjectId, ref: "groupMember" },
})

module.exports = ChatRoomSchema;