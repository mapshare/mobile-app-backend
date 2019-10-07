const mongoose = require("mongoose");
const GroupRoles = require('../../models/groupRoles');

module.exports = () => {
    return {
        getGroupRoles: () => {
            return new Promise((resolve, reject) => {
                GroupRoles.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addGroupRoles: (userData) => {
            return new Promise((resolve, reject) => {
                GroupRoles.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getGroupRolesById: (GroupRoleId) => {
            return new Promise((resolve, reject) => {
                GroupRoles.findById(GroupRoleId)
                    .populate('groupRoles')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Group Role with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateGroupRolesById: (GroupRoleId, newData) => {
            return new Promise((resolve, reject) => {
                let { groupRoleName,
                    groupRolePermisionLevel } = newData;

                GroupRoles.findById(GroupRoleId)
                    .then(groupRole => {
                        if (!groupRole) {
                            reject("Group Roles doesn't exist");
                            return;
                        }

                        groupRole.groupRoleName = groupRoleName ? groupRoleName : groupRole.groupRoleName;
                        groupRole.groupRolePermisionLevel = groupRolePermisionLevel ? groupRolePermisionLevel : groupRole.groupRolePermisionLevel;

                        groupRole.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        deleteGroupRolesById: (GroupRoleId) => {
            return new Promise((resolve, reject) => {
                GroupRoles.findById(GroupRoleId)
                    .then(groupRole => {
                        if (!groupRole) {
                            reject("GroupRoles doesn't exist");
                            return;
                        }
                        groupRole.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}