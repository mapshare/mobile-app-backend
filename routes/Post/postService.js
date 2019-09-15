const mongoose = require("mongoose");
const Post = require('../../models/post');
const GroupFeed = require('../../models/groupFeed');
const Users = require('../../models/user');


module.exports = () => {
    return {
        getPost: () => {
            return new Promise((resolve, reject) => {
                Post.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },
        getPostById: (id) => {
            return new Promise((resolve, reject) => {
                Post.findById(id)
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Post with specified id')
                    })
                    .catch(err => {
                        reject(err)
                    });

            });
        },
        addPost: (PostData) => {
            return new Promise((resolve, reject) => {
                let { postTitle, postContent, groupFeedId, userId } = PostData;

                if (!mongoose.Types.ObjectId.isValid(groupFeedId) & !mongoose.Types.ObjectId.isValid(userId)) {
                    reject({ "error": "groupFeedId or userId cannot be converted to valid ObjectId" });
                    return;
                }

                User.findById(userId)
                    .then(user => {
                        if (!user) {
                            reject({ "error": "user doesn't exist" })
                        } else {
                            user.push.Post(data._id);
                            user.save()
                                .then(userData => {
                                    GroupFeed.findById(groupFeedId).then(groupfeed => {
                                        if (!groupfeed) {
                                            reject({ "error": "groupfeed doesn't exist" })
                                        } else {
                                            Post.create({
                                                ...PostData,
                                                userId: user._id,
                                                groupfeedId: groupfeed._id
                                            }).then(data => {
                                                groupfeed.push.Post(data._id);
                                                groupfeed.save()
                                                    .then(groupData => {
                                                        resolve(data);
                                                    })
                                                    .catch(err => reject(err));
                                            });
                                        }
                                    }).catch(err => reject(err));
                                });
                        }
                    }).catch(err => reject(err));
            }).catch(err => reject(err));
        },
        updatePostById: (id, newData) => {
            return new Promise((resolve, reject) => {
                let { postTitle, postContent, groupFeedId, userId } = newData;

                if (!mongoose.Types.ObjectId.isValid(groupFeedId) & !mongoose.Types.ObjectId.isValid(userId)) {
                    reject({ "error": "groupFeedId or userId cannot be converted to valid ObjectId" });
                    return;
                }

                Post.findById(id)
                    .then(Post => {
                        if (!Post) {
                            reject("Post doesn't exist");
                            return;
                        }

                        Post.postTitle = postTitle ? postTitle : Post.postTitle
                        Post.postContent = postContent ? postContent : Post.postContent
                        Post.groupFeedId = groupFeedId ? groupFeedId : Post.groupFeedId
                        Post.userId = userId ? userId : Post.userId

                        Post.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        deletePostById: (id) => {
            return new Promise((resolve, reject) => {
                Post.findById(id)
                    .then(Post => {
                        if (!Post) {
                            reject("Post doesn't exist");
                            return;
                        }
                        Post.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}