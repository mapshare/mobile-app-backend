const mongoose = require("mongoose");
const GroupMember = require('../../models/groupMember');
const GroupFeed = require('../../models/groupFeed');
const GroupEvent = require('../../models/groupEvent');
const GroupMark = require('../../models/groupMarks');
const Group = require('../../models/group');

module.exports = () => {
    return {
        getGroupMember: () => {
            return new Promise((resolve, reject) => {
                GroupMember.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addGroupMember: (userData) => {
            return new Promise((resolve, reject) => {
                GroupMember.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getGroupMemberById: (GroupMemberId) => {
            return new Promise((resolve, reject) => {
                GroupMember.findById(GroupMemberId)
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Group Role with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateGroupMemberById: (GroupMemberId, newData) => {
            return new Promise((resolve, reject) => {
                let { user,
                    group,
                    groupMemberRole } = newData;

                GroupMember.findById(GroupMemberId)
                    .then(groupMember => {
                        if (!groupMember) {
                            reject("Group Roles doesn't exist");
                            return;
                        }

                        groupMember.user = user ? user : groupMember.user;
                        groupMember.group = group ? group : groupMember.group;
                        groupMember.groupMemberRole = groupMemberRole ? groupMemberRole : groupMember.groupMemberRole;

                        groupMember.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },

        deleteGroupMemberById: (GroupMemberId) => {
            return new Promise((resolve, reject) => {
                GroupMember.findById(GroupMemberId)
                    .then(groupMember => {
                        if (!groupMember) {
                            reject("GroupMember doesn't exist");
                            return;
                        }

                        // Deletes all Post created by Member
                        groupMember.groupMemberPosts.forEach(post => {
                            GroupFeed.findOneAndUpdate(
                                { group: groupMember.group },
                                { $pull: { groupPosts: { _id: post } } },
                                { new: true })
                                .then(data => { })
                                .catch(err => reject("Error Deleting posts: " + err));
                        });


                        // Deletes all marks and reviews created by Member
                        groupMember.groupMemberMarks.forEach(mark => {
                            GroupMark.findOneAndUpdate(
                                { group: groupMember.group },
                                { $pull: { groupMarks: { _id: mark } } },
                                { new: true })
                                .then(data => { })
                                .catch(err => reject("Error Deleting posts: " + err));
                        });

                        // Remove Member from event
                        GroupEvent.findOne({ group: groupMember.group }).exec()
                            .then(data => {
                                groupMember.groupMemberEvent.forEach(memberEvent => {
                                    data.groupEvents.findOneAndUpdate(
                                        { _id: memberEvent },
                                        { $pull: { eventMembers: groupMember._id } },
                                        { new: true })
                                        .then(data => { })
                                        .catch(err => reject("Error Deleting event: " + err));
                                });
                            })
                            .catch(err => reject(err));


                        // Remove Member from Group
                        Group.findOneAndUpdate(
                            { _id: groupMember.group },
                            { $pull: { groupMembers: groupMember._id } },
                            { new: true })
                            .then(data => { })
                            .catch(err => reject("Error removeing member from group: " + err));


                        // Delete group member
                        groupMember.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}