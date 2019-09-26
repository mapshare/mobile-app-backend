const mongoose = require("mongoose");
const DefaultEventCategory = require('../../../models/defaultEventCategory');

module.exports = () => {
    return {
        getDefaultEventCategory: () => {
            return new Promise((resolve, reject) => {
                DefaultEventCategory.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addDefaultEventCategory: (userData) => {
            return new Promise((resolve, reject) => {
                DefaultEventCategory.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getDefaultEventCategoryById: (DefaultEventCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultEventCategory.findById(DefaultEventCategoryId)
                    .populate('defaultEventCategory')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Group Role with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateDefaultEventCategoryById: (DefaultEventCategoryId, newData) => {
            return new Promise((resolve, reject) => {
                let { defaultEventCategoryName } = newData;

                DefaultEventCategory.findById(DefaultEventCategoryId)
                    .then(defaultEventCategory => {
                        if (!defaultEventCategory) {
                            reject("Group Roles doesn't exist");
                            return;
                        }

                        defaultEventCategory.defaultEventCategoryName = defaultEventCategoryName ? defaultEventCategoryName : defaultEventCategory.defaultEventCategoryName;

                        defaultEventCategory.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        deleteDefaultEventCategoryById: (DefaultEventCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultEventCategory.findById(DefaultEventCategoryId)
                    .then(defaultEventCategory => {
                        if (!defaultEventCategory) {
                            reject("DefaultEventCategory doesn't exist");
                            return;
                        }
                        defaultEventCategory.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}