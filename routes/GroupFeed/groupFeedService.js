const mongoose = require("mongoose");
const GroupFeed = require('../../models/group');

module.exports = () => {
    return {
        getGroupFeed: () => {
            return new Promise((resolve, reject) => {
                GroupFeed.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },
    }
}