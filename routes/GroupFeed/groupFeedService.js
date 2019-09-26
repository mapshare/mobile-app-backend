const mongoose = require("mongoose");
const GroupFeed = require('../../models/groupFeed');
const Group = require('../../models/group');

module.exports = () => {
    return {
        getGroupFeed: () => {
            return new Promise((resolve, reject) => {
                GroupFeed.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },
        getGroupFeedById: (id) => {
            return new Promise((resolve, reject) => {
                GroupFeed.findById(id)
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no GroupFeed with specified id')
                    })
                    .catch(err => {
                        reject(err)
                    });

            });
        },
        addGroupFeed: (groupFeedData) => {
            return new Promise((resolve, reject) => {
                let { group, groupPosts } = groupFeedData;

                if (!mongoose.Types.ObjectId.isValid(group)) {
                    reject({ "error": "groupId cannot be converted to valid ObjectId" });
                    return;
                }
                if (!mongoose.Types.Array === groupPosts) {
                    reject({ "error": "GroupPosts must be an array" });
                    return;
                }

                Group.findById(group).then(groupData => {
                    if (!groupData) {
                        reject({ "error": "group doesn't exist" })
                    } else {
                        GroupFeed.create({
                            ...groupFeedData
                        })
                            .then(data => {
                                groupData.groupFeed = data._id;
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
        updateGroupFeedById: (id, newData) => {
            return new Promise((resolve, reject) => {
                let { group, groupPosts } = newData;
                if (!mongoose.Types.ObjectId.isValid(group)) {
                    reject({ "error": "group cannot be converted to valid ObjectId" });
                    return;
                }
                
                GroupFeed.findById(id)
                    .then(groupFeed => {
                        if (!groupFeed) {
                            reject("GroupFeed doesn't exist");
                            return;
                        }
                        groupFeed.group = group ? group : groupFeed.group;
                        groupFeed.groupPosts = groupPosts ? groupPosts : groupFeed.groupPosts;
                        groupFeed.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err));
            });
        },
        deleteGroupFeedById: (id) => {
            return new Promise((resolve, reject) => {
                GroupFeed.findById(id)
                    .then(groupFeed => {
                        if (!groupFeed) {
                            reject("GroupFeed doesn't exist");
                            return;
                        }
                        groupFeed.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}