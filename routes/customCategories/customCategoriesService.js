const mongoose = require("mongoose");
const cCategories = require('../../models/customCategories');

module.exports = () => {
    return{
        getCategories: () => {
            return new Promise((resolve, reject) => {
                dCategories.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        getCategories: (cCategoriesId) => {
            return new Promise((resolve, reject) => {
                cCategories.findById(cCategoriesId)
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
        },

        addCategory: (categoryData) => {
            return new Promise((resolve, reject) => {

                if (!categoryData.categoryName) {
                    reject("need CategoriesId field")
                    return
                }

                cCategories.create({categoriesData}).then(data => {
                    resolve(data)
                }) .catch(err => reject(err))

            })
        }

    }
}