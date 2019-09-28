const mongoose = require("mongoose");
const Group = require('../../models/group');
const User = require('../../models/user');
const UserGroup = require('../../models/userGroup');
const GroupRole = require('../../models/groupRoles');
const GroupFeed = require('../../models/groupFeed');
const GroupEvent = require('../../models/groupEvent');
const UserEvent = require('../../models/userEvent');
const GroupMark = require('../../models/groupMarks');

module.exports = () => {
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

        addGroup: (newData) => {
            return new Promise((resolve, reject) => {
                if (!newData.userId) {
                    reject("need userId field");
                    return;
                }

                User.findById(newData.userId)
                    .then(userData => {
                        if (!userData) {
                            reject("user doesn't exist");
                            return;
                        }

                        const groupData = new Group({
                            groupName: newData.groupName
                        });

                        UserGroup.create({
                            user: newData.userId,
                            group: groupData._id,
                            userGroupRole: newData.groupRole
                        }).then(data => {
                            groupData.groupMembers.push(data.id);
                            userData.userGroup.push(data.id);


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

                            groupData.save()
                                .then(group => {
                                    userData.save()
                                        .then(user => {
                                            resolve(group)
                                        });
                                }).catch(err => reject(err));

                        }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        updateGroupById: (GroupId, newData) => {
            return new Promise((resolve, reject) => {
                let { groupName } = newData;

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        groupData.groupName = groupName ? groupName : groupData.groupName;

                        groupData.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },

        addGroupMember: (GroupId, newData) => {
            return new Promise((resolve, reject) => {
                let { newGroupMember, groupRole } = newData;

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
                                UserGroup.create({
                                    user: userData._id,
                                    group: groupData._id,
                                    userGroupRole: groupRole
                                }).then(data => {
                                    groupData.groupMembers.push(data.id);
                                    userData.userGroup.push(data.id);

                                    groupData.save()
                                        .then(group => {
                                            userData.save()
                                                .then(user => {
                                                    resolve(groupData)
                                                });
                                        });
                                }).catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
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
            }).catch(err => reject(err));
        },

        addGroupPost: (GroupId, newData) => {
            return new Promise((resolve, reject) => {

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupFeed.findById(groupData.groupFeed).exec()
                            .then(groupPostsData => {
                                groupPostsData.groupPosts.push(newData);
                                groupPostsData.save()
                                    .then(posts => {
                                        resolve({
                                            groupPosts: posts,
                                            addedPost: posts.groupPosts[posts.groupPosts.length - 1]
                                        })
                                    }).catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            }).catch(err => reject(err));
        },

        addGroupEvent: (GroupId, newData) => {
            return new Promise((resolve, reject) => {

                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        GroupEvent.findById(groupData.groupEvents)
                            .then(groupEventsData => {
                                groupEventsData.groupEvents.push(newData);
                                groupEventsData.save()
                                    .then(events => {
                                        resolve({
                                            groupEvents: events,
                                            addedEvent: events.groupEvents[events.groupEvents.length - 1]
                                        })
                                    })
                                    .catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            }).catch(err => reject(err));
        },

        deleteGroupById: (GroupId) => {
            return new Promise((resolve, reject) => {
                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        // Remove User Refence to Group
                        UserGroup.find({ group: groupData._id }).exec(function (err, data) {
                            data.forEach(element => {
                                User.findOneAndUpdate(
                                    { _id: element.user },
                                    { $pull: { userGroup: element._id } },
                                    { new: true })
                                    .then(data => { })
                                    .catch(err => reject(err));
                            });
                        });

                        // Remove UserGroups referencing Group
                        UserGroup.deleteMany({ group: groupData._id })
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



                        // Remove Event References to the User table 
                        GroupEvent.findOne({ group: groupData._id }).exec(function (err, data) {
                            if (data) {
                                data.groupEvents.forEach(event => {
                                    // Remove User References to UserEvent
                                    UserEvent.find({ event: event._id }).exec(function (err, data) {
                                        data.forEach(userEvent => {
                                            User.findOneAndUpdate(
                                                { _id: userEvent.user },
                                                { $pull: { userEvent: userEvent._id } },
                                                { new: true })
                                                .then(data => { })
                                                .catch(err => reject(err));
                                        });
                                    });

                                    // Remove UserEvent referencing Event
                                    UserEvent.deleteMany({ event: event._id })
                                        .then(data => { })
                                        .catch(err => reject(err));
                                });
                            }
                        });

                        // Delete Group Events Referencing to the Group being deleted
                        GroupEvent.deleteOne({ group: groupData._id })
                            .then(data => { })
                            .catch(err => reject(err));


                        // NOTE ADD REMOVE REVIEWS FROM MARKS ASWELL
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