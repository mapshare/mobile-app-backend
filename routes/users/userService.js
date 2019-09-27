const mongoose = require("mongoose");
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
                const newUser = new User({
                    ...userData
                })
                newUser.save()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            })
        },

        processUser: (userData) => {
            return new Promise((resolve, reject) => {

                let { userEmail, userFirstName, userLastName, googleId, userImages } = userData
                console.log(userData);

                if (!(userEmail && userFirstName && userLastName && googleId)) {
                    reject({ "error": "please provide userEmail, userFirstName, userLastName, googleId" })
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
                                googleId,
                                userImages: userImages
                            })
                                .then(data => {
                                    console.log('new user created')
                                    resolve(data)
                                })
                                .catch(err => { reject(err); console.log(err) })
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

        updateUserById: (userId, newData) => {
            return new Promise((resolve, reject) => {
                let { userGroup,
                    userPosts,
                    userEvent,
                    userEmail,
                    userFirstName,
                    userLastName,
                    googleId,
                    userImages,
                    userReviews } = newData;

                User.findById(userId)
                    .then(user => {
                        if (!user) {
                            reject("User doesn't exist");
                            return;
                        }

                        user.userGroup = userGroup ? userGroup : user.userGroup;
                        user.userPosts = userPosts ? userPosts : user.userPosts;
                        user.userEvent = userEvent ? userEvent : user.userEvent;
                        user.userEmail = userEmail ? userEmail : user.userEmail;
                        user.userFirstName = userFirstName ? userFirstName : user.userFirstName;
                        user.userLastName = userLastName ? userLastName : user.userLastName;
                        user.googleId = googleId ? googleId : user.googleId;
                        user.userImages = userImages ? userImages : user.userImages;
                        user.userReviews = userReviews ? userReviews : user.userReviews;

                        user.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        deleteUserbyId: (id) => {
            return new Promise((resolve, reject) => {
                User.findById(id)
                    .then(user => {
                        if (!user) {
                            reject("User doesn't exist");
                            return;
                        }
                        user.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}