const mongoose = require("mongoose");
const UnverifiedUser = require('../../models/unverifiedUser');

module.exports = () => {
    return {
        getUnverifiedUser: () => {
            return new Promise((resolve, reject) => {
                UnverifiedUser.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },
        getUnverifiedUserById: (id) => {
            return new Promise((resolve, reject) => {
                UnverifiedUser.findById(id)
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no unverifiedUser with specified id')
                    })
                    .catch(err => {
                        reject(err)
                    });

            });
        },
        addUnverifiedUser: (unverifiedUserData) => {
            return new Promise((resolve, reject) => {
                UnverifiedUser.create({
                    ...unverifiedUserData
                }).then(data => {
                    resolve(data)
                }).catch(err => reject(err));
            });
        },
        updateUnverifiedUserById: (id, newData) => {
            return new Promise((resolve, reject) => {
                let { unverifiedUserEmail, unverifiedUserFirstName, unverifiedUserLastName } = newData;

                UnverifiedUser.findById(id)
                    .then(unverifiedUser => {
                        if (!unverifiedUser) {
                            reject("unverifiedUser doesn't exist");
                            return;
                        }

                        unverifiedUser.unverifiedUserEmail = unverifiedUserEmail ? unverifiedUserEmail : unverifiedUser.unverifiedUserEmail;
                        unverifiedUser.unverifiedUserFirstName = unverifiedUserFirstName ? unverifiedUserFirstName : unverifiedUser.unverifiedUserFirstName;
                        unverifiedUser.unverifiedUserLastName = unverifiedUserLastName ? unverifiedUserLastName : unverifiedUser.unverifiedUserLastName;

                        unverifiedUser.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))

                    }).catch(err => reject(err));
            });
        },
        deleteUnverifiedUserById: (id) => {
            return new Promise((resolve, reject) => {
                UnverifiedUser.findById(id)
                    .then(unverifiedUser => {
                        if (!unverifiedUser) {
                            reject("unverifiedUser doesn't exist");
                            return;
                        }
                        unverifiedUser.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    }).catch(err => reject(err));
            });
        }
    }
}