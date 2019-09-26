const mongoose = require("mongoose");
const GroupLocation = require('../../models/groupLocation');
const Group = require('../../models/group');

module.exports = () => {
    return {
        getGroupLocation: () => {
            return new Promise((resolve, reject) => {
                GroupLocation.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },
        getGroupLocationById: (id) => {
            return new Promise((resolve, reject) => {
                GroupLocation.findById(id)
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no GroupLocation with specified id')
                    })
                    .catch(err => {
                        reject(err)
                    });

            });
        },
        addGroupLocation: (groupLocationData) => {
            return new Promise((resolve, reject) => {
                let { group, groupLocations } = groupLocationData;

                if (!mongoose.Types.ObjectId.isValid(group)) {
                    reject({ "error": "group cannot be converted to valid ObjectId" });
                    return;
                }
                if (!mongoose.Types.Array === groupLocations) {
                    reject({ "error": "groupLocations must be an array" });
                    return;
                }

                Group.findById(group).then(groupData => {
                    if (!groupData) {
                        reject({ "error": "group doesn't exist" })
                    } else {
                        GroupLocation.create({
                            ...groupLocationData
                        })
                            .then(data => {
                                groupData.groupLocation = data._id;
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
        updateGroupLocationById: (id, newData) => {
            return new Promise((resolve, reject) => {
                let { group } = newData;
                if (!mongoose.Types.ObjectId.isValid(group)) {
                    reject({ "error": "group cannot be converted to valid ObjectId" });
                    return;
                }

                GroupLocation.findById(id)
                    .then(groupLocation => {
                        if (!groupLocation) {
                            reject("GroupLocation doesn't exist");
                            return;
                        }
                        groupLocation.group = group ? group : groupLocation.group
                        groupLocation.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err));
            });
        },
        deleteGroupLocationById: (id) => {
            return new Promise((resolve, reject) => {
                GroupLocation.findById(id)
                    .then(groupLocation => {
                        if (!groupLocation) {
                            reject("GroupLocation doesn't exist");
                            return;
                        }
                        groupLocation.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}