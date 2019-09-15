const mongoose = require("mongoose");
const Post = require('../../models/post');

module.exports = () => {
    return {
        getPost: () => {
            return new Promise((resolve, reject) => {
                Post.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },
    }
}