const mongoose = require("mongoose");
const GroupEvent = require('../../models/groupEvent');
const Group = require('../../models/group');

module.exports = () => {
    return {
        getGroupEvent: () => {
            return new Promise((resolve, reject) => {
                GroupEvent.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },
        getGroupEventById: (id) => {
            return new Promise((resolve, reject) => {
                GroupEvent.findById(id)
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no GroupEvent with specified id')
                    })
                    .catch(err => {
                        reject(err)
                    });

            });
        },
        addGroupEvent: (groupEventData) => {
            return new Promise((resolve, reject) => {
                let { group, groupEvents } = groupEventData;

                if (!mongoose.Types.ObjectId.isValid(group)) {
                    reject({ "error": "group cannot be converted to valid ObjectId" });
                    return;
                }
                if (!mongoose.Types.Array === groupEvents) {
                    reject({ "error": "groupEvents must be an array" });
                    return;
                }

                Group.findById(group).then(groupData => {
                    if (!groupData) {
                        reject({ "error": "group doesn't exist" })
                    } else {
                        GroupEvent.create({
                            ...groupEventData
                        })
                            .then(data => {
                                groupData.groupEvents = data._id;
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
        updateGroupEventById: (id, newData) => {
            return new Promise((resolve, reject) => {
                let { group } = newData;
                if (!mongoose.Types.ObjectId.isValid(group)) {
                    reject({ "error": "group cannot be converted to valid ObjectId" });
                    return;
                }

                GroupEvent.findById(id)
                    .then(groupEvent => {
                        if (!groupEvent) {
                            reject("GroupEvent doesn't exist");
                            return;
                        }
                        groupEvent.group = group ? group : groupEvent.group
                        groupEvent.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err));
            });
        },
        deleteGroupEventById: (id) => {
            return new Promise((resolve, reject) => {
                GroupEvent.findById(id)
                    .then(groupEvent => {
                        if (!groupEvent) {
                            reject("GroupEvent doesn't exist");
                            return;
                        }
                        groupEvent.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}