const mongoose = require("mongoose");
const GroupMark = require('../../models/groupMarks');
const Group = require('../../models/group');

module.exports = () => {
    return {
        getGroupMark: () => {
            return new Promise((resolve, reject) => {
                GroupMark.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },
        getGroupMarkById: (id) => {
            return new Promise((resolve, reject) => {
                GroupMark.findById(id)
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no GroupMark with specified id')
                    })
                    .catch(err => {
                        reject(err)
                    });

            });
        },
        addGroupMark: (groupMarkData) => {
            return new Promise((resolve, reject) => {
                let { group, groupMarks } = groupMarkData;

                if (!mongoose.Types.ObjectId.isValid(group)) {
                    reject({ "error": "group cannot be converted to valid ObjectId" });
                    return;
                }
                if (!mongoose.Types.Array === groupMarks) {
                    reject({ "error": "groupMarks must be an array" });
                    return;
                }

                Group.findById(group).then(groupData => {
                    if (!groupData) {
                        reject({ "error": "group doesn't exist" })
                    } else {
                        GroupMark.create({
                            ...groupMarkData
                        })
                            .then(data => {
                                groupData.groupMark = data._id;
                                groupData.save()
                                    .then(d => {
                                        resolve(data)
                                    })
                                    .catch(err => {
                                        reject(err)
                                    })

                            })
                            .catch(err => reject(err));
                    }
                })
                    .catch(err => reject(err));
            });
        },
        updateGroupMarkById: (id, newData) => {
            return new Promise((resolve, reject) => {
                let { group, groupMarks } = newData;
                if (!mongoose.Types.ObjectId.isValid(group)) {
                    reject({ "error": "group cannot be converted to valid ObjectId" });
                    return;
                }

                GroupMark.findById(id)
                    .then(groupMark => {
                        if (!groupMark) {
                            reject("GroupMark doesn't exist");
                            return;
                        }
                        groupMark.group = group ? group : groupMark.group;
                        groupMark.groupMarks = groupMarks ? groupMarks : groupMark.groupMarks;
                        groupMark.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err));
            });
        },
        deleteGroupMarkById: (id) => {
            return new Promise((resolve, reject) => {
                GroupMark.findById(id)
                    .then(groupMark => {
                        if (!groupMark) {
                            reject("GroupMark doesn't exist");
                            return;
                        }
                        groupMark.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}