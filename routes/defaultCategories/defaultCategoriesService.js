const mongoose = require("mongoose");
const dCategories = require('../../models/defaultCategories');

module.exports = () => {
    return{
        getCategories: () => {
            return new Promise((resolve, reject) => {
                dCategories.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        getCategories: (dCategoriesId) => {
            return new Promise((resolve, reject) => {
                dCategories.findById(dCategoriesId)
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

                dCategories.create({categoriesData}).then(data => {
                    resolve(data)
                }) .catch(err => reject(err))

            })
        }

    }
}