const mongoose = require("mongoose");
const Group = require('../../models/group');
const User = require('../../models/user');
const GroupMember = require('../../models/groupMember');
const GroupChat = require('../../models/groupChat');
const GroupFeed = require('../../models/groupFeed');
const GroupEvent = require('../../models/groupEvent');
const GroupMark = require('../../models/groupMarks');
const GroupRole = require('../../models/groupRoles');
const DefaultCategory = require('../../models/defaultCategory');
const CustomCategory = require('../../models/groupCustomCategory')

const dataService = require("../groups/chatRoomService");
const ChatData = dataService();

const groupFeedDataService = require("../groups/groupFeedService");
const GroupFeedData = groupFeedDataService();

const DEFAULT_CATEGORY_DATA = require ('../../data/defaultCategory');

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

        getGroup: async (groupId, userId) => {
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

                const groupMemberRole = await GroupRole.findById(member.groupMemberRole);
                if (!groupMemberRole) throw ("Could not find group Member Role");

                let image;
                if (groupData.groupImg.data) {
                    image = groupData.groupImg.data.toString('base64');
                } else {
                    image = '';
                }


                return ({
                    _id: groupData._id,
                    groupRole: groupMemberRole,
                    groupName: groupData.groupName,
                    groupDescription: groupData.groupDescription,
                    groupImg: image,
                    groupMarks: groupData.groupMarks,
                    groupMembers: groupData.groupMembers,
                    groupFeed: groupData.groupFeed,
                    groupEvents: groupData.groupEvents,
                    groupChat: groupData.groupChat,
                    groupDefaultCategory: groupData.groupDefaultCategory,
                    groupCustomMarkCategory: groupData.groupCustomMarkCategory,
                    groupPendingMembers: groupData.groupPendingMembers,
                    groupCreatedBy: groupData.groupCreatedBy,
                });
            } catch (error) {
                console.log(error)
                throw ("getGroup: " + error);
            }
        },

        groupExists: async (groupId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");
                return { success: true };
            } catch (error) {
                throw ("searchGroups: " + error);
            }
        },

        searchGroups: async (userId, searchArg) => {
            try {
                user = await User.findById(userId);
                if (!user) throw ("Could not find User");

                var myMemberships = [];
                for (let groupMemberId of user.userGroups) {
                    const mbr = await GroupMember.findById(groupMemberId);
                    if (mbr) {
                        myMemberships.push({
                            _id: mbr._id,
                            group: mbr.group
                        });
                    }
                }

                let results;
                if (!searchArg.groupName) {
                    results = await Group.find({});
                } else {
                    const index = await Group.createIndexes();
                    results = await Group.find({ $text: { $search: searchArg.groupName } });
                }

                let addCreator = [];
                // Find Group Creator
                for (let group of results) {
                    user = await User.findById(group._doc.groupCreatedBy);
                    if (user) {
                        group._doc = { ...group._doc, createdBy: user };
                    }
                    addCreator.push(group)
                }

                let finalResults = [];
                for (let group of addCreator) {
                    for (let memberId of group.groupMembers) {
                        for (let mbr of myMemberships) {
                            if (mbr._id.toString() == memberId.toString()) {
                                group._doc = { ...group._doc, isMember: true };
                            } else if (!group._doc.isMember) {
                                group._doc = { ...group._doc, isMember: false };
                            }
                        }
                    }

                    for (let groupPending of group.groupPendingMembers) {
                        if (groupPending.userId.toString() == user._id.toString()) {
                            group._doc = { ...group._doc, isPending: true };
                        }
                    }

                    finalResults.push(group._doc);
                }
                
                return finalResults;
            } catch (error) {
                throw ("searchGroups: " + error);
            }
        },

        getGroupsAlphabetically: async (userId) => {
            try {
                user = await User.findById(userId);
                if (!user) throw ("Could not find User");

                var myMemberships = [];
                for (let groupMemberId of user.userGroups) {
                    const mbr = await GroupMember.findById(groupMemberId);
                    if (mbr) {
                        myMemberships.push({
                            _id: mbr._id,
                            group: mbr.group
                        });
                    }
                }

                let results = await Group.find();

                let addCreator = [];
                // Find Group Creator
                for (let group of results) {
                    let creator = await User.findById(group._doc.groupCreatedBy);
                    if (creator) {
                        const createdBy = {
                            _id: creator._id,
                            userEmail: creator.userEmail,
                            userFirstName: creator.userFirstName,
                            userLastName: creator.userLastName,
                        }
                        group._doc = { ...group._doc, createdBy: createdBy };
                    }
                    addCreator.push(group)
                }

                let finalResults = [];
                for (let group of addCreator) {
                    for (let memberId of group.groupMembers) {
                        for (let mbr of myMemberships) {
                            if (mbr._id.toString() == memberId.toString()) {
                                group._doc = { ...group._doc, isMember: true };
                            } else if (!group._doc.isMember) {
                                group._doc = { ...group._doc, isMember: false };
                            }
                        }
                    }

                    for (let groupPending of group.groupPendingMembers) {

                        if (groupPending.userId.toString() == user._id.toString()) {
                            group._doc = { ...group._doc, isPending: true };
                        }
                    }

                    finalResults.push(group._doc);
                }

                finalResults.sort((a, b) => a.groupName.localeCompare(b.groupName))
                const trimResults = []
                for (let grp of finalResults) {
                    trimResults.push({
                        _id: grp._id,
                        groupName: grp.groupName,
                        createdBy: grp.createdBy,
                        isPending: grp.isPending,
                        isMember: grp.isMember,
                    });
                }

                return trimResults;
            } catch (error) {
                throw ("getGroupsAlphabetically: " + error);
            }
        },

        getUserGroups: async (userId) => {
            try {

                user = await User.findById(userId);
                if (!user) throw ("Could not find User");

                var myMemberships = [];
                for (let groupMemberId of user.userGroups) {
                    const mbr = await GroupMember.findById(groupMemberId);
                    if (mbr) {
                        const groupMemberRole = await GroupRole.findById(mbr.groupMemberRole);
                        myMemberships.push({
                            _id: mbr._id,
                            group: mbr.group,
                            groupRolePermisionLevel: groupMemberRole.groupRolePermisionLevel,
                        });
                    }
                }

                let myGroups = [];
                for (let mbr of myMemberships) {
                    const groupData = await Group.findById(mbr.group);
                    if (groupData) {
                        myGroups.push({
                            _id: groupData._id,
                            groupName: groupData.groupName,
                            groupRolePermisionLevel: mbr.groupRolePermisionLevel
                        });
                    }
                }
                return myGroups;
            } catch (error) {
                throw ("getUserGroups: " + error);
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
            let user;
            let groupData;
            let newGroupMember;
            let groupFeedData;
            let groupEventData;
            let groupMarkData;
            let groupChatData;
            let groupCustomCategoryData;

            try {
                user = await User.findById(userId);
                if (!user) throw ("Could not find User")

                groupData = new Group({
                    groupName: newData.groupName,
                    groupCreatedBy: user._id,
                });

                const groupRole = await GroupRole.findOne({ "groupRolePermisionLevel": process.env.ROLE_OWNER });

                newGroupMember = await GroupMember.create({
                    user: user._id,
                    group: groupData._id,
                    groupMemberRole: groupRole._id
                });

                groupData.groupMembers.push(newGroupMember._id);
                user.userGroups.push(newGroupMember._id);

                groupFeedData = new GroupFeed({
                    "group": groupData._id,
                    "groupPosts": []
                });
                groupFeedData.save();
                groupData.groupFeed = groupFeedData._id;

                groupEventData = new GroupEvent({
                    "group": groupData._id,
                    "groupEvents": []
                });
                groupData.groupEvents = groupEventData._id;
                groupEventData.save();

                groupMarkData = new GroupMark({
                    "group": groupData._id,
                    "groupMarks": []
                });
                groupData.groupMarks = groupMarkData._id;
                groupMarkData.save();


                groupChatData = new GroupChat({
                    "group": groupData._id,
                    "groupChatRooms": [{
                        chatRoomName: "General",
                        chatRoomMembers: [newGroupMember._id],
                        chatRoomMessage: [],
                        chatRoomCreatedBy: newGroupMember._id,
                    }]
                });
                groupData.groupChat = groupChatData._id;
                groupChatData.save();

                groupCustomCategoryData = new CustomCategory({
                    "group": groupData._id,
                    "groupCustomCategories": []
                })
                groupData.groupCustomMarkCategory = groupCustomCategoryData._id;
                groupCustomCategoryData.save();

                const savedGroup = await groupData.save();
                const savedUser = await user.save();

                const setupNamespace = await ChatData.setupGroupNamespace(savedGroup._id, io);
                const setupGroupFeedNamespace = await GroupFeedData.setupGroupFeedNamespace(savedGroup._id, io);

                return savedGroup;
            } catch (error) {
                // If there is a problem remove data that was created
                const removeGroupData = await Group.deleteOne({ _id: groupData._id });
                user.userGroups.pull(newGroupMember._id);
                const savedUser = await user.save();
                const removeNewGroupMember = await GroupMember.deleteOne({ _id: newGroupMember._id });
                const removeGroupFeedData = await GroupFeed.deleteOne({ _id: groupFeedData._id });
                const removeGroupEventData = await GroupEvent.deleteOne({ _id: groupEventData._id });
                const removeGroupMarkData = await GroupMark.deleteOne({ _id: groupMarkData._id });
                const removeGroupChatData = await GroupChat.deleteOne({ _id: groupChatData._id });
                const removeGroupCustomCategoryData = await CustomCategory.deleteOne({ _id: groupCustomCategoryData._id });

                throw ("addGroup " + error)
            }
        },

        updateGroupById: async (groupId, newData) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");


                groupData.groupName = newData.groupName ? newData.groupName : groupData.groupName;
                groupData.groupDescription = newData.groupDescription ? newData.groupDescription : groupData.groupDescription;
                if (newData.groupImg) {
                    let contentType = 'image/png';
                    let buffer = Buffer.from(newData.groupImg, 'base64');
                    groupData.groupImg.data = buffer ? buffer : groupData.groupImg.data;
                    groupData.groupImg.contentType = contentType ? contentType : groupData.groupImg.contentType;
                }
                const savedGroup = await groupData.save();
                if (!savedGroup) throw ("Could not save Group");

                return savedGroup;
            } catch (error) {
                console.log(error)
                throw ("updateGroupById: " + error);
            }
        },
        /* REPLACED WITH reviewRequests
                addGroupMember: async (GroupId, newData) => {
                    let newGroupMember;
                    let groupData;
                    let user;
                    let groupChat;
                    try {
                        groupData = await Group.findById(groupId);
                        if (!groupData) throw ("Could not find Group");
        
                        user = await User.findById(userId);
                        if (!user) throw ("Could not find User");
        
                        const groupRole = await GroupRole.findOne({ "groupRolePermisionLevel": process.env.ROLE_MEMBER });
                        if (!groupRole) throw ("Could not find group role");
        
                        newGroupMember = await GroupMember.create({
                            user: user._id,
                            group: groupData._id,
                            groupMemberRole: groupRole._id
                        });
        
                        groupData.groupMembers.push(newGroupMember._id);
                        user.userGroups.push(newGroupMember._id);
        
                        const groupChatData = await GroupChat.findOneAndUpdate(
                            { "groupChatRooms.chatRoomName": "General" },
                            { $addToSet: { "groupChatRooms.$.chatRoomMembers": newGroupMember._id } },
                            { new: true }).exec();
                        if (!groupChatData) throw ("Could not find GroupChat");
        
                        console.log(groupChatData)
                        throw ("test");
                        const updatedChatRoom = groupChatData.groupChatRooms[groupChatData.groupChatRooms.length - 1];
        
                        member.groupMemberChatRooms.push(updatedChatRoom._id);
        
                        const savedUser = await user.save();
                        if (!savedUser) throw ("Could not save User");
        
                        const savedGroup = await groupData.save();
                        if (!savedGroup) throw ("Could not save Group");
        
                        return newGroupMember;
                    } catch (error) {
                        // If error delete added group member data 
                        const groupChatData = await GroupChat.findOneAndUpdate(
                            { "groupChatRooms.chatRoomName": "General" },
                            { $pull: { "groupChatRooms.$.chatRoomMembers": newGroupMember._id } },
                            { new: true }).exec();
                        groupData.groupMembers.pull(newGroupMember._id);
                        user.userGroups.pull(newGroupMember._id);
                        const savedUser = await user.save();
                        const savedGroup = await groupData.save();
                        const removeNewGroupMember = await GroupMember.deleteOne({ _id: newGroupMember._id });
                        throw ("addGroupMember: " + error);
                    }
                },
        */
        getAllGroupMember: async (groupId, userId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                var member = [];
                for (let groupMemberId of groupData.groupMembers) {
                    const mbr = await GroupMember.findById(groupMemberId);
                    if (mbr) {

                        const user = await User.findById(mbr.user);
                        if (!user) throw ("Could not find User");

                        const groupMemberRole = await GroupRole.findById(mbr.groupMemberRole);
                        if (!groupMemberRole) throw ("Could not find group Member Role");

                        member.push({
                            _id: mbr._id,
                            userFirstName: user.userFirstName,
                            userLastName: user.userLastName,
                            user: mbr.user,
                            groupMemberRole: groupMemberRole,
                        });
                    }
                }
                if (!member) throw ("Could not find Member");

                return member;
            } catch (error) {
                throw ("getAllGroupMember: " + error);
            }
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

                const memberRole = await GroupRole.findOne({ _id: member.groupMemberRole });
                if (!memberRole) throw ("Could not find Role");

                member = { ...member._doc, memberRole: memberRole };

                return member;
            } catch (error) {
                throw ("getGroupMember: " + error);
            }
        },

        updateGroupMemberById: async (newData) => {
            try {
                const mbr = await GroupMember.findById(newData.memberId);
                if (!mbr) throw ("Could not find Member");

                if (newData.groupRolePermisionLevel != undefined) {
                    const Role = await GroupRole.findOne({ groupRolePermisionLevel: newData.groupRolePermisionLevel });
                    if (!Role) throw ("Could not find Role");

                    mbr.groupMemberRole = Role._id;
                }

                const savedMember = await mbr.save();

                return { success: true };
            } catch (error) {
                console.log(error)
                throw ("updateGroupMemberById: " + error);
            }
        },

        requestToJoinGroup: async (groupId, userId) => {
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
                if (member) throw ("You are already a member of this group");

                const pendingUser = {
                    userId: user._id,
                    userEmail: user.userEmail,
                    userFirstName: user.userFirstName,
                    userLastName: user.userLastName,
                }

                let foundPendingUser;
                for (let pendingUser of groupData.groupPendingMembers) {
                    if (pendingUser._id == pendingMemberId) {
                        foundPendingUser = pendingUser;
                    }
                }

                if (!foundPendingUser) {
                    groupData.groupPendingMembers.push(pendingUser);

                    const savedGroup = await groupData.save()
                }
                return { success: true };
            } catch (error) {
                throw ("requestToJoinGroup: " + error);
            }
        },

        reviewRequests: async (groupId, pendingMemberData) => {
            let groupMember;
            let groupData;
            let user;
            let groupChat;

            try {
                groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                let foundPendingUser;
                for (let pendingUser of groupData.groupPendingMembers) {
                    if (pendingUser._id == pendingMemberData.pendingUserId) {
                        foundPendingUser = pendingUser;
                    }
                }
                if (!foundPendingUser) throw ("Could not find pending user");

                if (pendingMemberData.status) {
                    user = await User.findById(foundPendingUser.userId);
                    if (!user) throw ("Could not find User");

                    const groupRole = await GroupRole.findOne({ "groupRoleName": "Member" });
                    if (!groupRole) throw ("Could not find group role");

                    groupMember = await GroupMember.create({
                        user: user._id,
                        group: groupData._id,
                        groupMemberRole: groupRole._id
                    });

                    groupData.groupMembers.push(groupMember.id);
                    user.userGroups.push(groupMember.id);

                    groupChat = await GroupChat.findOneAndUpdate(
                        { "groupChatRooms.chatRoomName": "General" },
                        { $addToSet: { "groupChatRooms.$.chatRoomMembers": groupMember._id } },
                        { new: true }).exec();
                    if (!groupChat) throw ("Could not find GroupChat");


                    const updatedChatRoom = groupChat.groupChatRooms[0];
                    groupMember.groupMemberChatRooms.push(updatedChatRoom._id);

                    const savedUser = await user.save();
                    const savedMember = await groupMember.save();
                }

                // Save group twice due to front end loading bug need
                // to save member into group before deleteing pending member
                const savedGroup = await groupData.save();

                groupData.groupPendingMembers.pull(pendingMemberData.pendingUserId);

                const savedGroup2 = await groupData.save();
                return { success: true };
            } catch (error) {
                // If error exists delete created group member data 
                const groupChatData = await GroupChat.findOneAndUpdate(
                    { "groupChatRooms.chatRoomName": "General" },
                    { $pull: { "groupChatRooms.$.chatRoomMembers": groupMember._id } },
                    { new: true }).exec();

                groupData.groupMembers.pull(groupMember._id);
                user.userGroups.pull(groupMember._id);
                const savedUser = await user.save();
                const savedGroup = await groupData.save();
                const removeGroupMember = await GroupMember.deleteOne({ _id: groupMember._id });

                throw ("reviewRequests: " + error);
            }
        },

        getPendingRequests: async (groupId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                return groupData.groupPendingMembers;
            } catch (error) {
                throw ("getPendingRequests: " + error);
            }
        },

        deleteGroupMember: async (groupId, userId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const user = await User.findById(userId);
                if (!user) throw ("Could not find User");

                // throw error if the owner of the group tries to leave. 
                // if the owner wants to leave he must delete the group
                if (user._id.toString() == groupData.groupCreatedBy.toString()) {
                    throw ("Owner of the group cannot leave the group");
                }

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

        deleteGroupMemberById: async (groupId, memberId) => {
            try {
                const groupData = await Group.findById(groupId);
                if (!groupData) throw ("Could not find Group");

                const mbr = await GroupMember.findById(memberId);
                if (!mbr) throw ("Could not find mbr");

                const user = await User.findById(mbr.user);
                if (!user) throw ("Could not find User");

                // throw error if the owner of the group tries to leave. 
                // if the owner wants to leave he must delete the group
                if (user._id.toString() == groupData.groupCreatedBy.toString()) {
                    throw ("Owner of the group cannot leave the group");
                }

                user.userGroups.pull(mbr._id);
                groupData.groupMembers.pull(mbr._id);

                const deletedMember = await GroupMember.deleteOne({ _id: mbr._id });

                return ({ success: true });
            } catch (error) {
                console.log(error)
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
                                let image;

                                if (newData.markLocations.locationImageSet.locationImageData) {
                                    image = newData.markLocations.locationImageSet.locationImageData.toString('base64');
                                } else {
                                    image = '';
                                }

                                let data = {
                                    ...newData,
                                    markLocations: {
                                        locationAddress: newData.markLocations.locationAddress,
                                        loactionPriceRange: newData.markLocations.loactionPriceRange,
                                        additionalInformation: newData.markLocations.additionalInformation,
                                        locationImageSet: [{locationImageData: image}]
                                    },
                                }
                                
                                groupMarksData.groupMarks.push(data);
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

        addCustomCategoryMark: async (groupId, newData) => {
            return new Promise((resolve, reject) => {
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        CustomCategory.findById(groupData.groupCustomMarkCategory)
                            .then(customCategoryData => {
                                const data = {
                                    customMarkCategoryName: newData.customMarkCategoryName,
                                    isSelected: true,
                                    categoryColor: newData.categoryColor
                                }
                                
                                customCategoryData.groupCustomCategories.push(data);
                                customCategoryData.save()
                                    .then(data => {
                                        resolve({
                                            group: data.group,
                                            groupCustomCategories: data.groupCustomCategories
                                        })
                                    }).catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        getGroupMarks: async (groupMarkId) => {
            return new Promise((resolve, reject) => {
                GroupMark.findById(groupMarkId)
                    .then(data => {
                        if (data) resolve(data);
                        else reject("no group marks with specified id");
                    })
                    .catch(err => reject(err));
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

        getCustomCategoryMarks: async (groupCategoryId) => {
            return new Promise((resolve, reject) => {
                CustomCategory.findById(groupCategoryId)
                    .then(data => {
                        if (data) resolve(data);
                        else reject("no group category marks with specified id");
                    })
                    .catch(err => reject(err));
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
        },

        // Initialize group marks category
        initializeGroupMarksCategory: async (groupId) => {
            console.log('initializing group categories!')
            try {
                const defaultCategoryData = await DefaultCategory.find();
                if (!defaultCategoryData.length) {
                    for (categoryData of DEFAULT_CATEGORY_DATA) {
                        const category = await DefaultCategory.create({
                            defaultCategoryName: categoryData.defaultCategoryName,
                            isSelected: categoryData.isSelected,
                            categoryColor: categoryData.categoryColor
                        });
                    }
                }
            } catch (error) {
                throw ("initialize group marks category: " + error);
            }
        },
    }
}