const mongoose = require("mongoose");
const Group = require('../../models/group');
const User = require('../../models/user');
const UserGroup = require('../../models/userGroup');
const GroupRole = require('../../models/groupRoles');

module.exports = () => {
    return {
        getGroups: () => {
            return new Promise((resolve, reject) => {
                Group.find()
                    .populate("groupMarks") //.populate("groupMembers")
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
                    }).catch(err => reject(err));
                // Will need to create groupLocation, groupFeed and groupEvents table here aswel

                Group.create({
                    groupName: newData.groupName
                }).then(groupData => {
                    UserGroup.create({
                        user: newData.userId,
                        group: groupData._id,
                        userGroupRole: newData.groupRole
                    }).then(data => {
                        resolve(groupData)
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

        deleteGroupById: (GroupId) => {
            return new Promise((resolve, reject) => {
                Group.findById(GroupId)
                    .then(groupData => {
                        if (!groupData) {
                            reject("Group doesn't exist");
                            return;
                        }
                        // Should Delete Related userGroup documents
                        groupData.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}