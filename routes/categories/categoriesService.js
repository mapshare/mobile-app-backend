const mongoose = require("mongoose");
const Categories = require('../../models/categories');


module.exports = () => {
    return {
        getCategories: () => {
            return new Promise((resolve, reject) => {
                Categories.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        getCategories: (Id) => {
            return new Promise((resolve, reject) => {
                Categories.findById(Id)
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
        },

        addCategories: (categoriesData) => {
        }
    }
}