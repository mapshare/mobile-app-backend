const mongoose = require("mongoose");
const UserEvent = require('../../models/userEvent');

module.exports = () => {
    return {
        getUserEvent: () => {
            return new Promise((resolve, reject) => {
                UserEvent.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addUserEvent: (userData) => {
            return new Promise((resolve, reject) => {
                UserEvent.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getUserEventById: (UserEventId) => {
            return new Promise((resolve, reject) => {
                UserEvent.findById(UserEventId)
                    .populate('userEvent')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Group Event with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateUserEventById: (UserEventId, newData) => {
            return new Promise((resolve, reject) => {
                let { user,
                    group,
                    userEventRole } = newData;

                UserEvent.findById(UserEventId)
                    .then(userEvent => {
                        if (!userEvent) {
                            reject("Group Roles doesn't exist");
                            return;
                        }

                        userEvent.user = user ? user : userEvent.user;
                        userEvent.group = group ? group : userEvent.group;
                        userEvent.userEventRole = userEventRole ? userEventRole : userEvent.userEventRole;

                        userEvent.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        
        deleteUserEventById: (UserEventId) => {
            return new Promise((resolve, reject) => {
                UserEvent.findById(UserEventId)
                    .then(userEvent => {
                        if (!userEvent) {
                            reject("UserEvent doesn't exist");
                            return;
                        }
                        userEvent.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}