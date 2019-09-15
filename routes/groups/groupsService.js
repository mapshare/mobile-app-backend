const mongoose = require("mongoose");
const Restaurant = require('../../models/restaurant');
const Group = require('../../models/group');
const Mark = require('../../models/mark');
const Review = require('../../models/review');
const User = require('../../models/user');

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

        addGroup: (groupData) => {
            return new Promise((resolve, reject) => {

                if (!groupData.userId) {
                    reject("need userId field")
                    return
                }

                User.findById(groupData.userId)
                    .then(userData => {

                        if (!userData) {
                            reject("user doesn't exist")
                            return
                        }

                        Group.create({
                            ...groupData,
                            groupMembers: [groupData.userId]   // add initial groupmember
                        })
                            .then(data => {
                                console.log('groupId: ', data.groupId)
                                userData.userGroups.push(data.groupId)

                                userData.save()
                                    .then(() => resolve(data))
                                    .catch(err => {
                                        reject({ "group created, but couldn't add group to user": err })
                                    })

                            })
                            .catch(err => reject(err));

                    })
                    .catch(err => reject(err))

            })
        }
    }
}