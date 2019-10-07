const mongoose = require("mongoose");
const DefaultCategory = require('../../models/defaultCategory');

module.exports = () => {
    return {
        getDefaultCategory: () => {
            return new Promise((resolve, reject) => {
                DefaultCategory.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addDefaultCategory: (userData) => {
            return new Promise((resolve, reject) => {
                DefaultCategory.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getDefaultCategoryById: (DefaultCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultCategory.findById(DefaultCategoryId)
                    .populate('defaultCategory')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no  Role with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateDefaultCategoryById: (DefaultCategoryId, newData) => {
            return new Promise((resolve, reject) => {
                let { defaultCategoryName } = newData;

                DefaultCategory.findById(DefaultCategoryId)
                    .then(defaultCategory => {
                        if (!defaultCategory) {
                            reject(" Roles doesn't exist");
                            return;
                        }

                        defaultCategory.defaultCategoryName = defaultCategoryName ? defaultCategoryName : defaultCategory.defaultCategoryName;

                        defaultCategory.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        deleteDefaultCategoryById: (DefaultCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultCategory.findById(DefaultCategoryId)
                    .then(defaultCategory => {
                        if (!defaultCategory) {
                            reject("DefaultCategory doesn't exist");
                            return;
                        }
                        defaultCategory.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}