const mongoose = require("mongoose");
const User = require("../../models/user");
const GroupMember = require("../../models/groupMember");
const Group = require("../../models/group");
const GroupChat = require("../../models/groupChat");
var socketioJwt = require("socketio-jwt"); const jwt = require("jsonwebtoken");

const verifyLoginToken = async (token) => {
    try {
        const verified = jwt.verify(token, process.env.LOGIN_TOKEN);
        return verified;
    } catch (error) {
        throw ("Invalid Token " + error);
    }
}

const getUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw ("Could not find User")

        return user;

    } catch (error) {
        throw ("getUser " + error);
    }
}

const getMember = async (groupId, user) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        var member;
        for (let groupMemberId of user.userGroups) {
            const mbr = await GroupMember.findById(groupMemberId);
            if (mbr) {
                if (mbr.group == groupId) {
                    member = mbr;
                    break;
                }
            }
        }
        if (!member) throw ("Could not find Member");

        return member;

    } catch (error) {
        throw ("getMember " + error);
    }
}

const getChatRoom = async (groupId, member, chatRoomId) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        const groupChatData = await GroupChat.findOne({ _id: groupData.groupChat });
        let chatRoom = "";
        for (let groupChatRoom of groupChatData.groupChatRooms) {
            if (groupChatRoom) {
                if (chatRoomId == groupChatRoom._id) {
                    chatRoom = groupChatRoom;
                    break;
                }
            }
        }
        if (!chatRoom) throw ("Could not find Chat Room");

        let isMember = true;
        for (let chatMember of chatRoom.chatRoomMembers) {
            if (chatMember) {
                if (chatMember == member._id) {
                    chatRoom = groupChatRoom;
                }
            }
        }
        if (!isMember) throw ("Member is not part of this chatroom");

        return chatRoom;

    } catch (error) {
        throw ("getChatRoom " + error);
    }
}


const getChatRoomByName = async (groupId, member, chatRoomName) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        const groupChatData = await GroupChat.findOne({ _id: groupData.groupChat });
        if (!groupChatData) throw ("Could not find Group chatRoom");

        let chatRoom = "";
        for (let groupChatRoom of groupChatData.groupChatRooms) {
            if (groupChatRoom) {
                if (chatRoomName == groupChatRoom.chatRoomName) {
                    chatRoom = groupChatRoom;
                    break;
                }
            }
        }
        if (!chatRoom) throw ("Could not find Chat Room");

        let isMember = true;
        for (let chatMember of chatRoom.chatRoomMembers) {
            if (chatMember) {
                if (chatMember == member._id) {
                    chatRoom = groupChatRoom;
                }
            }
        }
        if (!isMember) throw ("Member is not part of this chatroom");

        return chatRoom;

    } catch (error) {
        throw ("getChatRoomByName " + error);
    }
}

const getChatLog = async (groupId, member, chatRoomId) => {
    try {
        const chatRoom = await getChatRoom(groupId, member, chatRoomId);

        return chatRoom.chatRoomMessage;

    } catch (error) {
        throw ("getChatLog " + error);
    }
}

const addChatMessage = async (groupId, user, member, chatRoomId, message) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        let chatRoom;
        const groupChatData = await GroupChat.findById(groupData.groupChat);
        for (let groupChatRoom of groupChatData.groupChatRooms) {
            if (groupChatRoom._id == chatRoomId) {
                chatRoom = groupChatRoom;
            }
        }
        if (!chatRoom) throw ("Could not find Chat Room");

        let newMessage = {
            messageBody: message,
            messageCreatedByName: user.userFirstName + " " + user.userLastName,
            messageCreatedBy: member._id,
        }
        chatRoom.chatRoomMessage.unshift(newMessage);

        const savedGroupChat = await groupChatData.save();
        if (!savedGroupChat) throw ("Could not save chat");

        let UpdatedChatRoom;
        for (let groupChatRoom of savedGroupChat.groupChatRooms) {
            if (groupChatRoom._id == chatRoomId) {
                UpdatedChatRoom = groupChatRoom;
            }
        }
        if (!UpdatedChatRoom) throw ("Could not find Updated Chat Room");

        return UpdatedChatRoom.chatRoomMessage;

    } catch (error) {
        throw ("addChatMessage " + error);
    }
}

const updateChatMessage = async (groupId, user, member, chatRoomId, messageId, updatedMessage) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        let chatRoom;
        const groupChatData = await GroupChat.findById(groupData.groupChat);
        for (let groupChatRoom of groupChatData.groupChatRooms) {
            if (groupChatRoom._id == chatRoomId) {
                chatRoom = groupChatRoom;
            }
        }
        if (!chatRoom) throw ("Could not find Chat Room");

        var msgIndex = -1;
        for (var i = 0; i < chatRoom.chatRoomMessage.length; i++) {
            if (chatRoom.chatRoomMessage[i]._id == chatMessageId) {
                msgIndex = i;
                break;
            }
        }
        let newMessage = {
            messageBody: message.messageBody,
            messageCreatedByName: user.userFirstName,
            messageCreatedBy: member._id,
        }
        chatRoom.chatRoomMessage[msgIndex].messageBody = newMessage ? newMessage : chatRoom.chatRoomMessage[msgIndex].messageBody;

        const savedGroupChat = await groupChatData.save();
        if (!savedGroupChat) throw ("Could not save chat");

        let savedChatroom;
        for (let groupChatRoom of savedGroupChat.groupChatRooms) {
            if (groupChatRoom._id == chatRoomId) {
                savedChatroom = groupChatRoom;
            }
        }
        if (!savedChatroom) throw ("Could not find Chat Room");

        return savedChatroom.chatRoomMessage;

    } catch (error) {
        throw ("updateChatMessage " + error);
    }
}


const deleteChatMessage = async (groupId, chatRoomId, messageId) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        let chatRoom;
        const groupChatData = await GroupChat.findById(groupData.groupChat);
        for (let groupChatRoom of groupChatData.groupChatRooms) {
            if (groupChatRoom._id == chatRoomId) {
                chatRoom = groupChatRoom;
            }
        }
        if (!chatRoom) throw ("Could not find Chat Room");

        chatRoom.chatRoomMessage.pull(messageId);

        const savedGroupChat = await groupChatData.save();
        if (!savedGroupChat) throw ("Could not save chat");

        return savedGroupChat;

    } catch (error) {
        throw ("updateChatMessage " + error);
    }
}


module.exports = () => {
    return {
        setupGroupNamespace: async (groupId, io) => {
            try {
                var activeMembers = [];
                // Setup GroupChat NameSpace
                const nsp = io
                    .of('/' + groupId)
                    .on('connection', async (socket) => {
                        var userId;
                        var chatRoomId;
                        var chatRoomName;
                        var user;
                        var member;
                        var chatRoom;
                        var group;

                        socket.on('authenticate', async (token) => {
                            try {
                                userId = await verifyLoginToken(token);
                                if (!userId) {
                                    throw ("Could Not Verify Token");
                                }
                                socket.emit('authenticated', true);
                            } catch (error) {
                                socket.emit('unauthorized', error);
                            }
                        });

                        socket.on('join room', async (data) => {
                            try {
                                console.log('join room')
                                let groupId = data.groupId;
                                chatRoomName = data.chatRoomName;
                                group = groupId;
                                user = await getUser(userId);
                                member = await getMember(group, user);
                                chatRoom = await getChatRoomByName(group, member, chatRoomName);
                                chatRoomId = chatRoom._id.toString();
                                socket.join(chatRoom.chatRoomName);
                                member = await getMember(group, user);

                                // Add User to Active Member List
                                activeMembers.push(user)

                                const chatLog = await getChatLog(group, member, chatRoomId);
                                console.log("Sending room")
                                nsp.to(chatRoom.chatRoomName).emit('join room', {
                                    chatRoomId: chatRoomId,
                                    data: chatLog
                                });

                                nsp.to(chatRoom.chatRoomName).emit('User Joined or Left', activeMembers);

                            } catch (error) {
                                throw (error);
                            }
                        });

                        socket.on('new message', async (message) => {
                            try {
                                console.log('new message')
                                const chatLog = await addChatMessage(group, user, member, chatRoomId, message);
                                nsp.to(chatRoom.chatRoomName).emit('new message', {
                                    chatRoomId: chatRoomId,
                                    data: chatLog
                                });
                            } catch (error) {
                                throw (error);
                            }
                        });

                        socket.on('update message', async (messageId, updatedMessage) => {
                            try {
                                // This will send the full chat log and the user will refresh there chat log
                                const chatLog = await updateChatMessage(group, user, member, chatRoomId, messageId, updatedMessage);
                                socket.broadcast.to(chatRoom.chatRoomName).emit('update message', chatLog);
                            } catch (error) {
                                throw (error);
                            }
                        });

                        socket.on('delete message', async (messageId) => {
                            try {
                                // This will send the full chat log and the user will refresh there chat log
                                const chatLog = await deleteChatMessage(group, user, member, chatRoomId, messageId);
                                socket.to(chatRoom.chatRoomName).broadcast.emit('delete message', chatLog);
                            } catch (error) {
                                throw (error);
                            }
                        });

                        socket.on('typing', () => {
                            socket.to(chatRoom.chatRoomName).broadcast.emit('typing', {
                                userFirstName: user.userFirstName
                            });
                        });

                        socket.on('stop typing', () => {
                            socket.to(chatRoom.chatRoomName).broadcast.emit('stop typing', {
                                userFirstName: user.userFirstName
                            });
                        });

                        socket.on('disconnect', async () => {
                            console.log("disconnect Chat")
                            for (var i = 0; i < activeMembers.length; i++) {
                                console.log(activeMembers[i])
                                if (activeMembers[i]._id == user._id) {
                                    arr.splice(i, 1);
                                    break;
                                }
                            }
                            
                            nsp.to(chatRoom.chatRoomName).emit('User Joined or Left', activeMembers);
                        });

                    });

                return;

            } catch (error) {
                throw ("setupGroup " + error)
            }
        }
    }
};
