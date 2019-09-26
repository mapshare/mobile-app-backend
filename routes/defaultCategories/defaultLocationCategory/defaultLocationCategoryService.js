const mongoose = require("mongoose");
const DefaultLocationCategory = require('../../../models/defaultLocationCategory');

module.exports = () => {
    return {
        getDefaultLocationCategory: () => {
            return new Promise((resolve, reject) => {
                DefaultLocationCategory.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addDefaultLocationCategory: (userData) => {
            return new Promise((resolve, reject) => {
                DefaultLocationCategory.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getDefaultLocationCategoryById: (DefaultLocationCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultLocationCategory.findById(DefaultLocationCategoryId)
                    .populate('defaultLocationCategory')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Group Role with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateDefaultLocationCategoryById: (DefaultLocationCategoryId, newData) => {
            return new Promise((resolve, reject) => {
                let { defaultLocationCategoryName } = newData;

                DefaultLocationCategory.findById(DefaultLocationCategoryId)
                    .then(defaultLocationCategory => {
                        if (!defaultLocationCategory) {
                            reject("Group Roles doesn't exist");
                            return;
                        }

                        defaultLocationCategory.defaultLocationCategoryName = defaultLocationCategoryName ? defaultLocationCategoryName : defaultLocationCategory.defaultLocationCategoryName;

                        defaultLocationCategory.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        deleteDefaultLocationCategoryById: (DefaultLocationCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultLocationCategory.findById(DefaultLocationCategoryId)
                    .then(defaultLocationCategory => {
                        if (!defaultLocationCategory) {
                            reject("DefaultLocationCategory doesn't exist");
                            return;
                        }
                        defaultLocationCategory.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}