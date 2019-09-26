const mongoose = require("mongoose");
const DefaultGroupCategory = require('../../../models/defaultGroupCategory');

module.exports = () => {
    return {
        getDefaultGroupCategory: () => {
            return new Promise((resolve, reject) => {
                DefaultGroupCategory.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addDefaultGroupCategory: (userData) => {
            return new Promise((resolve, reject) => {
                DefaultGroupCategory.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getDefaultGroupCategoryById: (DefaultGroupCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultGroupCategory.findById(DefaultGroupCategoryId)
                    .populate('defaultGroupCategory')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Group Role with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateDefaultGroupCategoryById: (DefaultGroupCategoryId, newData) => {
            return new Promise((resolve, reject) => {
                let { defaultGroupCategoryName } = newData;

                DefaultGroupCategory.findById(DefaultGroupCategoryId)
                    .then(defaultGroupCategory => {
                        if (!defaultGroupCategory) {
                            reject("Group Roles doesn't exist");
                            return;
                        }

                        defaultGroupCategory.defaultGroupCategoryName = defaultGroupCategoryName ? defaultGroupCategoryName : defaultGroupCategory.defaultGroupCategoryName;

                        defaultGroupCategory.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        deleteDefaultGroupCategoryById: (DefaultGroupCategoryId) => {
            return new Promise((resolve, reject) => {
                DefaultGroupCategory.findById(DefaultGroupCategoryId)
                    .then(defaultGroupCategory => {
                        if (!defaultGroupCategory) {
                            reject("DefaultGroupCategory doesn't exist");
                            return;
                        }
                        defaultGroupCategory.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}