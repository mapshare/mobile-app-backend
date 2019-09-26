const mongoose = require("mongoose");
const Group = require('../../models/group');
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

                let { userEmail, userFirstName, userLastName, googleId } = userData

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
                    userReviews,
                    userCustomGroupCategory,
                    userCustomLocationCategory,
                    userCustomEventCategory,
                    userCustomPostCategory } = newData;

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
                        user.userCustomGroupCategory = userCustomGroupCategory ? userCustomGroupCategory : user.userCustomGroupCategory;
                        user.userCustomLocationCategory = userCustomLocationCategory ? userCustomLocationCategory : user.userCustomLocationCategory;
                        user.userCustomEventCategory = userCustomEventCategory ? userCustomEventCategory : user.userCustomEventCategory;
                        user.userCustomPostCategory = userCustomPostCategory ? userCustomPostCategory : user.userCustomPostCategory;

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