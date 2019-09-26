const mongoose = require("mongoose");
const DefaultPostCategory = require('../../../models/defaultPostCategory');

module.exports = () => {
    return {
        getDefaultPostCategory: () => {
            return new Promise((resolve, reject) => {
                DefaultPostCategory.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addDefaultPostCategory: (userData) => {
            return new Promise((resolve, reject) => {
                DefaultPostCategory.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getDefaultPostCategoryById: (DefaultPostCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultPostCategory.findById(DefaultPostCategoryId)
                    .populate('defaultPostCategory')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Group Role with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateDefaultPostCategoryById: (DefaultPostCategoryId, newData) => {
            return new Promise((resolve, reject) => {
                let { defaultPostCategoryName } = newData;

                DefaultPostCategory.findById(DefaultPostCategoryId)
                    .then(defaultPostCategory => {
                        if (!defaultPostCategory) {
                            reject("Group Roles doesn't exist");
                            return;
                        }

                        defaultPostCategory.defaultPostCategoryName = defaultPostCategoryName ? defaultPostCategoryName : defaultPostCategory.defaultPostCategoryName;

                        defaultPostCategory.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        deleteDefaultPostCategoryById: (DefaultPostCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultPostCategory.findById(DefaultPostCategoryId)
                    .then(defaultPostCategory => {
                        if (!defaultPostCategory) {
                            reject("DefaultPostCategory doesn't exist");
                            return;
                        }
                        defaultPostCategory.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}