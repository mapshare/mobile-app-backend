const mongoose = require("mongoose");
const Group = require('../../models/group');
const User = require('../../models/user');
const GroupMember = require('../../models/groupMember');
const GroupChat = require('../../models/groupChat');
const GroupFeed = require('../../models/groupFeed');
const GroupEvent = require('../../models/groupEvent');
const GroupMark = require('../../models/groupMarks');
const GroupRole = require('../../models/groupRoles');

const dataService = require("../groups/chatRoomService");
const ChatData = dataService();

module.exports = (io) => {
    return {
        getGroups: () => {
            return new Promise((resolve, reject) => {
                Group.find()
                    //.populate("groupMarks") //.populate("groupMembers")
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        getGroup: (groupId) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
        },

        searchGroups: async (searchArg) => {
            try {
                let results;
                if (!searchArg.groupName) {
                    results = await Group.find({});
                } else {
                    const index = await Group.createIndexes();
                    results = await Group.find({ $text: { $search: searchArg.groupName } });
                }
                return results;
            } catch (error) {
                throw ("searchGroups: " + error);
            }
        },


        searchGroupChatRooms: async (groupId, searchArg) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                let results = []

                const groupChatData = await GroupChat.findOne({ group: groupData._id })

                if (searchArg.chatRoomName) {
                    for (let chatRoom of groupChatData.groupChatRooms) {
                        let isMatch = chatRoom.chatRoomName.search('/' + searchArg.chatRoomName + '/i');
                        if (isMatch != -1) {
                            const room = {
                                chatRoomName: chatRoom.chatRoomName,
                                _id: chatRoom._id
                            }
                            results.push(room);
                        }
                    }
                } else {
                    for (let chatRoom of groupChatData.groupChatRooms) {
                        const room = {
                            chatRoomName: chatRoom.chatRoomName,
                            _id: chatRoom._id
                        }
                        results.push(room);
                    }
                }

                return results;
            } catch (error) {
                throw ("searchGroups: " + error);
            }
        },

        getListOfChatRooms: async (groupId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const groupChatData = await GroupChat.findById(groupData.groupChat);
                if (!groupData) throw ("Could not find Group Chat");

                return groupChatData.groupChatRooms;

            } catch (error) {
                throw ("getListOfChatRooms " + error);
            }
        },

        addGroup: async (userId, newData) => {
            try {
                const user = await User.findById(userId);
                if (!user) throw ("Could not find User")

                const groupData = new Group({
                    groupName: newData.groupName
                });

                const groupRole = await GroupRole.findOne({ "groupRolePermisionLevel": process.env.ROLE_ADMIN });

                const newGroupMember = await GroupMember.create({
                    user: user._id,
                    group: groupData._id,
                    groupMemberRole: groupRole._id
                });

                groupData.groupMembers.push(newGroupMember.id);
                user.userGroups.push(newGroupMember.id);

                const groupFeedData = new GroupFeed({
                    "group": groupData._id,
                    "groupPosts": []
                });
                groupFeedData.save();
                groupData.groupFeed = groupFeedData._id;

                const groupEventData = new GroupEvent({
                    "group": groupData._id,
                    "groupEvents": []
                });
                groupData.groupEvents = groupEventData._id;
                groupEventData.save();

                const groupMarkData = new GroupMark({
                    "group": groupData._id,
                    "groupMarks": []
                });
                groupData.groupMarks = groupMarkData._id;
                groupMarkData.save();


                const groupChatData = new GroupChat({
                    "group": groupData._id,
                    "groupChatRooms": []
                });
                groupData.groupChat = groupChatData._id;
                groupChatData.save();

                const savedGroup = await groupData.save();
                const savedUser = await user.save();

                const setupNamespace = await ChatData.setupGroupNamespace(savedGroup._id, io);

                return savedGroup;
            } catch (error) {
                throw ("addGroup " + error)
            }
        },

        updateGroupById: async (groupId, newData) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                groupData.groupName = newData.groupName ? newData.groupName : groupData.groupName;

                const savedGroup = await groupData.save();
                if (!savedGroup) throw ("Could not save Group");

                return savedGroup;
            } catch (error) {
                throw ("updateGroupById: " + error);
            }
        },

        addGroupMember: (GroupId, newData) => {
            return new Promise((resolve, reject) => {
                let { newGroupMember } = newData;

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        User.findById(newGroupMember)
                            .then(userData => {
                                if (!userData) {
                                    reject("User doesn't exist");
                                    return;
                                }
                                GroupRole.findOne({ "groupRoleName": "Member" })
                                    .then(groupRole => {
                                        GroupMember.create({
                                            user: userData._id,
                                            group: groupData._id,
                                            groupMemberRole: groupRole._id
                                        }).then(data => {
                                            groupData.groupMembers.push(data.id);
                                            userData.userGroups.push(data.id);

                                            groupData.save()
                                                .then(group => {
                                                    userData.save()
                                                        .then(user => {
                                                            resolve(data)
                                                        });
                                                });
                                        }).catch(err => reject("Error could not create groupMember: " + err));
                                    }).catch(err => reject("Error could not find groupRole: " + err));
                            }).catch(err => reject("Error could not find User: " + err));
                    }).catch(err => reject("Error could not find Group: " + err));
            });
        },

        getGroupMember: async (groupId, userId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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
                throw ("getGroupMember: " + error);
            }
        },

        deleteGroupMember: async (groupId, userId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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

                user.userGroups.pull(member._id);
                groupData.groupMembers.pull(member._id);

                const deletedMember = await GroupMember.deleteOne({ _id: member._id });

                return ({ success: true });
            } catch (error) {
                throw ("deleteGroupMember: " + error);
            }
        },

        addGroupMark: (GroupId, newData) => {
            return new Promise((resolve, reject) => {

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupMark.findById(groupData.groupMarks)
                            .then(groupMarksData => {
                                groupMarksData.groupMarks.push(newData);
                                groupMarksData.save()
                                    .then(marks => {
                                        resolve({
                                            groupMarks: marks,
                                            addedMark: marks.groupMarks[marks.groupMarks.length - 1]
                                        })
                                    })
                                    .catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        addGroupPost: async (groupId, userId, newData) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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

                const groupPostsData = await GroupFeed.findById(groupData.groupFeed).exec();
                if (!groupPostsData) throw ("Could not find Member");

                const postData = {
                    postTitle: newData.postTitle,
                    postContent: newData.postContent,
                    postCreatedBy: member._id
                };
                groupPostsData.groupPosts.push(postData);
                const posts = await groupPostsData.save()
                const addedPost = posts.groupPosts[posts.groupPosts.length - 1];

                member.groupMemberPosts.push(addedPost._id);
                const savedMember = await member.save();
                if (!savedMember) throw ("Could not save Member");

                return ({
                    groupPosts: posts,
                    addedPost: addedPost
                });

            } catch (error) {
                throw ("addGroupPost: " + error);
            }
        },

        addGroupEvent: async (groupId, userId, newData) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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

                var groupEventsData = await GroupEvent.findById(groupData.groupEvents);
                if (!groupEventsData) throw ("Could not find GroupEvents for this group");

                const newEvent = {
                    eventName: newData.eventName,
                    eventDescription: newData.eventDescription,
                    eventMembers: [member._id],
                    eventMark: newData.eventMark,
                    eventCreatedBy: member._id
                };

                groupEventsData.groupEvents.push(newEvent);
                const events = await groupEventsData.save();
                if (!events) throw ("Could not save event");

                const addedEvent = events.groupEvents[events.groupEvents.length - 1];

                member.groupMemberEvent.push(addedEvent._id);
                const savedMember = await member.save();
                if (!savedMember) throw ("Could not save Member");

                return {
                    groupEvents: events,
                    addedEvent: addedEvent,
                    member: member
                };
            } catch (error) {
                throw ("addGroupEvent: " + error);
            }
        },

        addGroupMemberToEvent: async (groupId, userId, eventId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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

                const groupEventData = await GroupEvent.findOneAndUpdate(
                    { "groupEvents._id": eventId },
                    { $addToSet: { "groupEvents.$.eventMembers": member._id } },
                    { new: true }).exec();
                if (!groupEventData) throw ("Could not find GroupEvent");

                member.groupMemberEvent.push(eventId);
                const savedMember = await member.save();
                if (!savedMember) throw ("Could not save Member");

                return groupEventData;
            } catch (error) {
                throw ("addGroupMemberToEvent: " + error);
            }
        },

        addChatRoom: async (groupId, userId, newData) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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

                const groupChatData = await GroupChat.findById(groupData.groupChat);
                if (!groupChatData) throw ("Could not find groupChat");

                const chatRoomData = {
                    chatRoomName: newData.chatRoomName,
                    chatRoomMembers: [member._id],
                    chatRoomCreatedBy: member._id
                }

                groupChatData.groupChatRooms.push(chatRoomData);
                const groupChat = await groupChatData.save();
                const addedChatRoom = groupChat.groupChatRooms[groupChat.groupChatRooms.length - 1];

                member.groupMemberChatRooms.push(addedChatRoom._id);
                const savedMember = await member.save();
                if (!savedMember) throw ("Could not save Member");

                return ({
                    groupChat: groupChat,
                    addedChatRoom: addedChatRoom
                });

            } catch (error) {
                throw ("addChatRoom: " + error);
            }
        },

        addGroupMemberToChatRoom: async (groupId, userId, chatRoomId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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

                const groupChatData = await GroupChat.findOneAndUpdate(
                    { "groupChatRooms._id": chatRoomId },
                    { $addToSet: { "groupChatRooms.$.chatRoomMembers": member._id } },
                    { new: true }).exec();
                if (!groupChatData) throw ("Could not find GroupChat");

                const updatedChatRoom = groupChatData.groupChatRooms[groupChatData.groupChatRooms.length - 1];

                member.groupMemberChatRooms.push(updatedChatRoom._id);
                const savedMember = await member.save();
                if (!savedMember) throw ("Could not save Member");

                return ({
                    groupMember: member,
                    groupChat: updatedChatRoom
                });
            } catch (error) {
                throw ("addGroupMemberToChatRoom: " + error);
            }
        },

        addChatMessage: async (groupId, userId, chatRoomId, newData) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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

                const messageData = {
                    messageBody: newData.messageBody,
                    messageCreatedBy: member._id
                }

                const groupChatData = await GroupChat.findOneAndUpdate(
                    { "groupChatRooms._id": chatRoomId },
                    { $addToSet: { "groupChatRooms.$.chatRoomMessage": messageData } },
                    { new: true }).exec();
                if (!groupChatData) throw ("Could not find GroupChat");

                const chatRoomMessages = groupChatData.groupChatRooms[groupChatData.groupChatRooms.length - 1].chatRoomMessage;

                return chatRoomMessages;
            } catch (error) {
                throw ("addChatMessage: " + error);
            }
        },

        deleteGroupMemberFromEvent: async (groupId, userId, eventId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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

                const groupEventData = await GroupEvent.findOneAndUpdate(
                    { "groupEvents._id": eventId },
                    { $pull: { "groupEvents.$.eventMembers": member._id } },
                    { new: true }).exec();
                if (!groupEventData) throw ("Could not find group event");

                return groupEventData;

            } catch (error) {
                throw ("deleteGroupMemberFromEvent: " + error);
            }
        },

        addCustomCategoryMark: (groupId, newData) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        groupData.groupCustomMarkCategory.push(newData);

                        groupData.save()
                            .then(data => { resolve(data) })
                            .catch(err => reject(err));

                    }).catch(err => reject(err));
            });
        },

        getGroupMark: (GroupId, markId) => {
            return new Promise((resolve, reject) => {

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupMark.findById(groupData.groupMarks)
                            .then(groupMarksData => {
                                var markIndex = -1;
                                for (var i = 0; i < groupMarksData.groupMarks.length; i++) {
                                    if (groupMarksData.groupMarks[i]._id == markId) {
                                        markIndex = i;
                                    }
                                }

                                resolve({
                                    groupMarks: groupMarksData,
                                    mark: groupMarksData.groupMarks[markIndex]
                                });
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        getGroupPost: (GroupId, postId) => {
            return new Promise((resolve, reject) => {

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupFeed.findById(groupData.groupFeed).exec()
                            .then(groupPostsData => {
                                var postIndex = -1;
                                for (var i = 0; i < groupPostsData.groupPosts.length; i++) {
                                    if (groupPostsData.groupPosts[i]._id == postId) {
                                        postIndex = i;
                                    }
                                }

                                resolve({
                                    groupPosts: groupPostsData,
                                    post: groupPostsData.groupPosts[postIndex]
                                });
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        getGroupEvent: (GroupId, eventId) => {
            return new Promise((resolve, reject) => {

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupEvent.findById(groupData.groupEvents)
                            .then(groupEventsData => {
                                var eventIndex = -1;
                                for (var i = 0; i < groupEventsData.groupEvents.length; i++) {
                                    if (groupEventsData.groupEvents[i]._id == eventId) {
                                        eventIndex = i;
                                    }
                                }

                                resolve({
                                    groupEvents: groupEventsData,
                                    event: groupEventsData.groupEvents[eventIndex]
                                });
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        getCustomCategoryMark: (groupId, categoryId) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        var markCategoryIndex = -1;
                        for (var i = 0; i < groupData.groupCustomMarkCategory.length; i++) {
                            if (groupData.groupCustomMarkCategory[i]._id == categoryId) {
                                markCategoryIndex = i;
                            }
                        }

                        resolve({
                            group: groupData,
                            category: groupData.groupCustomMarkCategory[markCategoryIndex]
                        });
                    }).catch(err => reject(err));
            });
        },

        getChatRoom: async (groupId, chatRoomId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const groupChatData = await GroupChat.findOne({ group: groupData._id })

                let chatRoom;
                for (let room of groupChatData.groupChatRooms) {
                    if (room._id == chatRoomId) {
                        chatRoom = room;
                    }
                }
                return chatRoom;

            } catch (error) {
                throw ("getChatRoom " + error);
            }
        },

        updateGroupMark: (GroupId, markId, newData) => {
            return new Promise((resolve, reject) => {

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupMark.findById(groupData.groupMarks)
                            .then(groupMarksData => {
                                var markIndex = -1;
                                for (var i = 0; i < groupMarksData.groupMarks.length; i++) {
                                    if (groupMarksData.groupMarks[i]._id == markId) {
                                        markIndex = i;
                                    }
                                }
                                groupMarksData.groupMarks[markIndex].markName = newData.markName ? newData.markName : groupMarksData.groupMarks[markIndex].markName;
                                groupMarksData.groupMarks[markIndex].markLocations = newData.markLocations ? newData.markLocations : groupMarksData.groupMarks[markIndex].markLocations;
                                groupMarksData.groupMarks[markIndex].geometry = newData.geometry ? newData.geometry : groupMarksData.groupMarks[markIndex].geometry;

                                groupMarksData.save()
                                    .then(marks => {
                                        resolve({
                                            groupMarks: marks,
                                            updatedMark: groupMarksData.groupMarks[markIndex]
                                        })
                                    })
                                    .catch(err => reject(err));
                            })
                    }).catch(err => reject(err));
            });
        },

        updateGroupPost: (GroupId, postId, newData) => {
            return new Promise((resolve, reject) => {

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupFeed.findById(groupData.groupFeed).exec()
                            .then(groupPostsData => {
                                var postIndex = -1;
                                for (var i = 0; i < groupPostsData.groupPosts.length; i++) {
                                    if (groupPostsData.groupPosts[i]._id == postId) {
                                        postIndex = i;
                                    }
                                }

                                groupPostsData.groupPosts[postIndex].postTitle = newData.postTitle ? newData.postTitle : groupPostsData.groupPosts[postIndex].postTitle;
                                groupPostsData.groupPosts[postIndex].postContent = newData.postContent ? newData.postContent : groupPostsData.groupPosts[postIndex].postContent;

                                groupPostsData.save()
                                    .then(posts => {
                                        resolve({
                                            groupPosts: posts,
                                            updatedPost: posts.groupPosts[postIndex]
                                        })
                                    }).catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        updateGroupEvent: (GroupId, eventId, newData) => {
            return new Promise((resolve, reject) => {

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupEvent.findById(groupData.groupEvents)
                            .then(groupEventsData => {
                                var eventIndex = -1;
                                for (var i = 0; i < groupEventsData.groupEvents.length; i++) {
                                    if (groupEventsData.groupEvents[i]._id == eventId) {
                                        eventIndex = i;
                                    }
                                }
                                groupEventsData.groupEvents[eventIndex].eventName = newData.eventName ? newData.eventName : groupEventsData.groupEvents[eventIndex].eventName;
                                groupEventsData.groupEvents[eventIndex].eventDescription = newData.eventDescription ? newData.eventDescription : groupEventsData.groupEvents[eventIndex].eventDescription;

                                groupEventsData.save()
                                    .then(events => {
                                        resolve({
                                            groupEvents: events,
                                            updatedEvent: events.groupEvents[eventIndex]
                                        })
                                    })
                                    .catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        updateCustomCategoryMark: (groupId, categoryId, newData) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        var markCategoryIndex = -1;
                        for (var i = 0; i < groupData.groupCustomMarkCategory.length; i++) {
                            if (groupData.groupCustomMarkCategory[i]._id == categoryId) {
                                markCategoryIndex = i;
                            }
                        }

                        groupData.groupCustomMarkCategory[markCategoryIndex].customMarkCategoryName = newData.customMarkCategoryName ? newData.customMarkCategoryName : groupData.groupCustomMarkCategory[markCategoryIndex].customMarkCategoryName;

                        groupData.save()
                            .then(data => {
                                resolve({
                                    group: data,
                                    updatedCategory: data.groupCustomMarkCategory[markCategoryIndex]
                                })
                            })
                            .catch(err => reject(err));

                    }).catch(err => reject(err));
            });
        },

        updateChatRoom: (groupId, chatRoomId, newData) => {
            return new Promise((resolve, reject) => {

                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupChat.findById(groupData.groupChat)
                            .then(groupChatData => {
                                var index = -1;
                                for (var i = 0; i < groupChatData.groupChatRooms.length; i++) {
                                    if (groupChatData.groupChatRooms[i]._id == chatRoomId) {
                                        index = i;
                                    }
                                }

                                groupChatData.groupChatRooms[index].chatRoomName = newData.chatRoomName ? newData.chatRoomName : groupChatData.groupChatRooms[index].chatRoomName;

                                groupChatData.save()
                                    .then(groupChat => {
                                        resolve({
                                            groupChat: groupChat,
                                            updatedChatRoom: groupChatData.groupChatRooms[index]
                                        });
                                    }).catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        updateChatMessage: (groupId, chatRoomId, chatMessageId, newData) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        GroupChat.findById(groupData.groupChat)
                            .then(groupChat => {
                                var roomIndex = -1;
                                var msgIndex = -1;
                                for (var i = 0; i < groupChat.groupChatRooms.length; i++) {
                                    if (groupChat.groupChatRooms[i]._id == chatRoomId) {
                                        roomIndex = i;
                                        for (var j = 0; j < groupChat.groupChatRooms[j].chatRoomMessage.length; j++) {
                                            if (groupChat.groupChatRooms[j].chatRoomMessage[j]._id == chatMessageId) {
                                                msgIndex = j;
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                                groupChat.groupChatRooms[roomIndex].chatRoomMessage[msgIndex].messageBody = newData.messageBody ? newData.messageBody : groupChat.groupChatRooms[roomIndex].chatRoomMessage[msgIndex].messageBody;

                                groupChat.save()
                                    .then(groupChat => {
                                        resolve(groupChat.groupChatRooms[roomIndex].chatRoomMessage[msgIndex])
                                    }).catch(err => reject("Error could save chatRoom: " + err));
                            }).catch(err => reject("Error could find chatRoom: " + err));
                    }).catch(err => reject("Error could find group: " + err));
            });
        },

        deleteCustomCategoryMark: (groupId, id) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        groupData.groupCustomMarkCategory.pull({ _id: id });

                        groupData.save()
                            .then(data => { resolve(data) })
                            .catch(err => reject(err));
                    }).catch(err => reject("Error: " + err));
            });
        },

        deleteGroupMark: (groupId, markId) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupMark.findById(groupData.groupMarks)
                            .then(groupMarksData => {
                                groupMarksData.groupMarks.pull(markId);
                                groupMarksData.save()
                                    .then(marks => {
                                        resolve(marks)
                                    })
                                    .catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        deleteGroupEvent: (groupId, eventId) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupEvent.findById(groupData.groupEvents)
                            .then(groupEventsData => {
                                groupEventsData.groupEvents.pull(eventId);
                                groupEventsData.save()
                                    .then(events => {
                                        resolve(events)
                                    })
                                    .catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        deleteGroupPost: (groupId, postId) => {
            return new Promise((resolve, reject) => {

                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupFeed.findById(groupData.groupFeed).exec()
                            .then(groupPostsData => {
                                groupPostsData.groupPosts.pull(postId);
                                groupPostsData.save()
                                    .then(posts => {
                                        resolve(posts)
                                    }).catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        deleteChatRoom: (groupId, chatRoomId) => {
            return new Promise((resolve, reject) => {

                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupChat.findById(groupData.groupChat)
                            .then(groupChatData => {
                                groupChatData.groupChatRooms.pull(chatRoomId);

                                groupChatData.save()
                                    .then(groupChat => {
                                        resolve(groupChat)
                                    }).catch(err => reject("Error could save chatRoom: " + err));

                            }).catch(err => reject("Error could find chatRoom: " + err));
                    }).catch(err => reject("Error could not find group" + err));
            });
        },

        deleteGroupMemberFromChatRoom: async (groupId, userId, chatRoomId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

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

                const groupChatData = await GroupChat.findOneAndUpdate(
                    { "groupChatRooms._id": chatRoomId },
                    { $pull: { "groupChatRooms.$.chatRoomMembers": member._id } },
                    { new: true }).exec();
                if (!groupChatData) throw ("Could not find GroupChat");


                member.groupMemberChatRooms.pull(chatRoomId);
                const savedMember = await member.save();
                if (!savedMember) throw ("Could not save Member");

                return groupChatData.groupChatRooms[0];
            } catch (error) {
                throw ("deleteGroupMemberFromChatRoom: " + error);
            }
        },

        deleteChatMessage: (groupId, chatRoomId, chatMessageId) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        GroupChat.findById(groupData.groupChat)
                            .then(groupChat => {
                                var index = -1;
                                for (var i = 0; i < groupChat.groupChatRooms.length; i++) {
                                    if (groupChat.groupChatRooms[i]._id == chatRoomId) {
                                        groupChat.groupChatRooms[i].chatRoomMessage.pull(chatMessageId);
                                        index = i;
                                        break;
                                    }
                                }
                                groupChat.save()
                                    .then(groupChat => {
                                        resolve({
                                            groupChat: groupChat.groupChatRooms[index],
                                            messages: groupChat.groupChatRooms[index].chatRoomMessage
                                        });
                                    }).catch(err => reject("Error could save chatRoom: " + err));
                            }).catch(err => reject("Error could find chatRoom: " + err));
                    }).catch(err => reject(err));
            });
        },

        deleteGroupById: (GroupId) => {
            return new Promise((resolve, reject) => {
                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        // Remove Group Chat References to the GroupMember table 
                        GroupChat.findOne({ group: groupData._id }).exec(function (err, data) {
                            if (data) {
                                data.groupChatRooms.forEach(chatRoom => {
                                    chatRoom.chatRoomMembers.forEach(member => {
                                        GroupMember.findById(member)
                                            .then(memberData => {
                                                if (!memberData) {
                                                    reject("Member doesn't exist");
                                                    return;
                                                }
                                                memberData.groupMemberChatRooms.pull(chatRoom._id);
                                                memberData.save()
                                                    .then(data => { })
                                                    .catch(err => reject(err));
                                            });
                                    });
                                });
                            }
                        });

                        // Delete Group Chat Referencing to the Group being deleted
                        GroupChat.deleteOne({ group: groupData._id })
                            .then(data => { })
                            .catch(err => reject(err));


                        // Remove User Reference to Group
                        GroupMember.find({ group: groupData._id }).exec(function (err, data) {
                            data.forEach(element => {
                                User.findOneAndUpdate(
                                    { _id: element.user },
                                    { $pull: { groupMember: element._id } },
                                    { new: true })
                                    .then(data => { })
                                    .catch(err => reject(err));
                            });
                        });

                        // Remove GroupMembers referencing Group
                        GroupMember.deleteMany({ group: groupData._id })
                            .then(data => { })
                            .catch(err => reject(err));



                        // Remove Posts References to the User table 
                        GroupFeed.findOne({ group: groupData._id }).exec(function (err, data) {
                            if (data) {
                                data.groupPosts.forEach(element => {
                                    User.findOneAndUpdate(
                                        { _id: element.user },
                                        { $pull: { userPosts: element._id } },
                                        { new: true })
                                        .then(data => { })
                                        .catch(err => reject(err));
                                });
                            }
                        });

                        // Delete Group Feed Referencing to the Group being deleted
                        GroupFeed.deleteOne({ group: groupData._id })
                            .then(data => { })
                            .catch(err => reject(err));



                        // Remove Event References to the groupMember table 
                        GroupEvent.findOne({ group: groupData._id }).exec(function (err, data) {
                            if (data) {
                                data.groupEvents.forEach(event => {
                                    GroupMember.findOneAndUpdate(
                                        { "groupMemberEvent.$._id": event._id },
                                        { $pull: { "groupMemberEvent.$._id": event._id } },
                                        { new: true })
                                        .then(data => { })
                                        .catch(err => reject(err));
                                });
                            }
                        });

                        // Delete Group Events Referencing to the Group being deleted
                        GroupEvent.deleteOne({ group: groupData._id })
                            .then(data => { })
                            .catch(err => reject(err));

                        // Remove Mark References to the User table 
                        GroupMark.findOne({ group: groupData._id }).exec(function (err, data) {
                            if (data) {
                                data.groupMarks.forEach(mark => {
                                    User.findOneAndUpdate(
                                        { _id: mark.groupMarkCreatedBy },
                                        { $pull: { userMarks: mark._id } },
                                        { new: true })
                                        .then(data => { })
                                        .catch(err => reject(err));
                                });
                            }
                        });

                        // Delete Group Mark Referencing to the Group being deleted
                        GroupMark.deleteOne({ group: groupData._id })
                            .then(data => { })
                            .catch(err => reject(err));

                        // Delete Group
                        Group.deleteOne({ _id: groupData._id })
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        }
    }
}