const mongoose = require("mongoose");
const Post = require('../../models/post');
const GroupFeed = require('../../models/groupFeed');
const User = require('../../models/user');


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
                            GroupFeed.findById(groupFeedId).then(groupfeed => {
                                if (!groupfeed) {
                                    reject({ "error": "groupfeed doesn't exist" })
                                } else {
                                    Post.create({
                                        postTitle: postTitle,
                                        postContent: postContent,
                                        userId: userId,
                                        groupFeedId: groupFeedId
                                    }).then(data => {
                                        groupfeed.postsId.push(data._id);
                                        user.postsId.push(data._id);
                                        user.save()
                                            .then(userData => {
                                                groupfeed.save()
                                                    .then(groupData => {
                                                        resolve(data);
                                                    }).catch(err => reject(err));
                                            }).catch(err => reject(err));
                                    }).catch(err => reject(err));
                                }
                            }).catch(err => reject(err));
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
                    .then(post => {
                        if (!post) {
                            reject("Post doesn't exist");
                            return;
                        }
                        post.postTitle = postTitle ? postTitle : post.postTitle
                        post.postContent = postContent ? postContent : post.postContent
                        post.groupFeedId = groupFeedId ? groupFeedId : post.groupFeedId
                        post.userId = userId ? userId : post.userId
                        console.log("\n\n\n");
                        console.log(post);
                        console.log("\n\n\n");
                        post.save()
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