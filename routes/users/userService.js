const mongoose = require("mongoose");
const Restaurant = require('../../models/restaurant');
const Group = require('../../models/group');
const Mark = require('../../models/mark');
const Review = require('../../models/review');
const User = require('../../models/user');

module.exports = () => {
    return {
        getUsers: () => {
            return new Promise((resolve, reject) => {
                User.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addUser: (userData) => {
            return new Promise((resolve, reject) => {
                console.log('new user data: ', userData)

                // format creation body first?
                // create. if exists, return error? currently email can't be duplicate
                User.create({ ...userData })
                    .then(data => {
                        console.log('userId: ', data.userId)
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        processUser: (userData) => {
            return new Promise((resolve, reject) => {

                let { userEmail, userFirstName, userLastName, googleId, userPicture } = userData

                if (!(userEmail && userFirstName && userLastName && userPicture && googleId)) {
                    reject({ "error": "please provide userEmail, userFirstName, userLastName, googleId, userPicture" })
                    return
                }

                User.findOne({ googleId })
                    .then(data => {
                        if (data) {
                            resolve(data)
                        } else {
                            User.create({
                                userEmail,
                                userFirstName,
                                userLastName,
                                userPicture,
                                googleId
                            })
                                .then(data => {
                                    console.log('new user created')
                                    resolve(data)
                                })
                                .catch(err => reject(err))
                        }
                    })
                    .catch(err => reject(err))
            })
        },

        getUserById: (userId) => {
            return new Promise((resolve, reject) => {

                User.findById(userId)
                    .populate('userGroups')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no user with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateUserById: (userId, userData) => {
            return new Promise((resolve, reject) => {

                let { addGroup, removeGroup } = userData

                if ((addGroup && removeGroup) || !(addGroup || removeGroup)) {
                    reject("either include addGroup or removeGroup (xor)")
                    return
                }

                let groupId = addGroup ? addGroup : removeGroup

                Group.findById(groupId)
                    .then(doc => {

                        if (!doc) {
                            reject("group doesn't exist") //TURN INTO 404????????????
                            return
                        }
                        else if (doc.groupMembers.some(id => { return id.equals(userId) })) {
                            if (removeGroup) {
                                doc.groupMembers.splice(doc.groupMembers.indexOf(userId), 1)
                            } else {
                                reject("user already in group")
                                return
                            }
                        }
                        else if (removeGroup) {
                            reject("user not in group")
                            return
                        }

                        User.findOneAndUpdate(
                            { _id: userId },
                            addGroup ? {
                                $push: { userGroups: mongoose.Types.ObjectId(addGroup) }
                            } : {
                                    $pull: { userGroups: mongoose.Types.ObjectId(removeGroup) }
                                },
                            { new: true }
                        )
                            .then(data => {
                                if (data) {
                                    console.log('user exists')
                                    if (addGroup) {
                                        doc.groupMembers.push(userId)
                                    }
                                    doc.save()
                                        .then(data => console.log("new group:", data))
                                        .catch(err => console.log("error when saving updated group", err))
                                    console.log("successfull in updating user", data)
                                    resolve(data)
                                } else {
                                    reject("user does not exist")
                                }
                            })
                            .catch(err => {
                                console.log('error deleting group from user')
                                reject(err)
                            })
                    })
                    .catch(err => reject(err))
            })
        }
    }
}