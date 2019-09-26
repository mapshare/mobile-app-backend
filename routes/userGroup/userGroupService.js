const mongoose = require("mongoose");
const UserGroup = require('../../models/userGroup');

module.exports = () => {
    return {
        getUserGroup: () => {
            return new Promise((resolve, reject) => {
                UserGroup.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addUserGroup: (userData) => {
            return new Promise((resolve, reject) => {
                UserGroup.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getUserGroupById: (UserGroupId) => {
            return new Promise((resolve, reject) => {
                UserGroup.findById(UserGroupId)
                    .populate('userGroup')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Group Role with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateUserGroupById: (UserGroupId, newData) => {
            return new Promise((resolve, reject) => {
                let { user,
                    group,
                    userGroupRole } = newData;

                UserGroup.findById(UserGroupId)
                    .then(userGroup => {
                        if (!userGroup) {
                            reject("Group Roles doesn't exist");
                            return;
                        }

                        userGroup.user = user ? user : userGroup.user;
                        userGroup.group = group ? group : userGroup.group;
                        userGroup.userGroupRole = userGroupRole ? userGroupRole : userGroup.userGroupRole;

                        userGroup.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        
        deleteUserGroupById: (UserGroupId) => {
            return new Promise((resolve, reject) => {
                UserGroup.findById(UserGroupId)
                    .then(userGroup => {
                        if (!userGroup) {
                            reject("UserGroup doesn't exist");
                            return;
                        }
                        userGroup.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}