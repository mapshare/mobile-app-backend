const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChatRoom = require("./groupChatSubDocs/chatRoom");

// create group Chat Schema & model
const GroupChatSchema = new Schema({
    group: { type: Schema.Types.ObjectId, ref: "group" },
    groupRooms: [
        ChatRoom
    ],
});


const GroupChat = mongoose.model('GroupChat', GroupChatSchema);
module.exports = GroupChat;