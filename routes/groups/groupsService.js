const mongoose = require("mongoose");
const Group = require('../../models/group');
const User = require('../../models/user');
const GroupMember = require('../../models/groupMember');
const GroupRole = require('../../models/groupRoles');
const GroupFeed = require('../../models/groupFeed');
const GroupEvent = require('../../models/groupEvent');
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

                        GroupMember.create({
                            user: newData.userId,
                            group: groupData._id,
                            groupMemberRole: newData.groupRole
                        }).then(data => {
                            groupData.groupMembers.push(data.id);
                            userData.userGroups.push(data.id);


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
                                GroupMember.create({
                                    user: userData._id,
                                    group: groupData._id,
                                    groupMemberRole: groupRole
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
                                }).catch(err => reject(err));
                            }).catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        },

        deleteGroupMember: (groupId, groupMemberId, memberId) => {
            return new Promise((resolve, reject) => {

                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        User.findById(memberId)
                            .then(userData => {
                                if (!userData) {
                                    reject("User doesn't exist");
                                    return;
                                }
                                userData.userGroups.pull(data._id);
                                groupData.groupMembers.pull(data._id);
                                groupData.save()
                                    .then(group => {
                                        userData.save()
                                            .then(user => { });
                                    });

                                GroupMember.deleteOne({ _id: groupMemberId })
                                    .then(data => { resolve(data); })
                                    .catch(err => reject(err));
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
            });
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
            });
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
            });
        },

        addGroupMemberToEvent: (groupId, eventId, newData) => {
            return new Promise((resolve, reject) => {
                let { newGroupMember } = newData;
                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        GroupEvent.findOneAndUpdate(
                            { "groupEvents._id": eventId },
                            { $addToSet: { "groupEvents.$.eventMembers": newGroupMember } }
                        ).then(data => {
                            GroupEvent.findOne({ "groupEvents._id": eventId })
                                .then(data => {
                                    resolve(data)
                                }).catch(err => reject("Error could find event: " + err));
                        }).catch(err => reject("Error could not add member to event: " + err));

                    }).catch(err => reject(err));
            });
        },

        deleteGroupMemberFromEvent: (groupId, eventId, memberId) => {
            return new Promise((resolve, reject) => {

                Group.findById(groupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        GroupEvent.findOneAndUpdate(
                            { "groupEvents._id": eventId },
                            { $pull: { "groupEvents.$.eventMembers": memberId } }
                        ).then(data => {
                            GroupEvent.findOne({ "groupEvents._id": eventId })
                                .then(data => {
                                    resolve(data)
                                }).catch(err => reject("Error could find event: " + err));
                        }).catch(err => reject("Error could not remove member to event: " + err));
                    }).catch(err => reject(err));
            });
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

        deleteGroupById: (GroupId) => {
            return new Promise((resolve, reject) => {
                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }

                        // Remove User Refence to Group
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