const mongoose = require("mongoose");
const User = require("../../models/user");
const GroupMember = require("../../models/groupMember");
const Group = require("../../models/group");
const GroupFeed = require("../../models/groupFeed");
const sharp = require('sharp');
var socketioJwt = require("socketio-jwt");
const jwt = require("jsonwebtoken");

const verifyLoginToken = async (token) => {
    try {
        const verified = jwt.verify(token, process.env.LOGIN_TOKEN);
        return verified;
    } catch (error) {
        throw ("Invalid Token " + error);
    }
}

const getUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw ("Could not find User")

        return user;

    } catch (error) {
        throw ("getUser " + error);
    }
}

const getMember = async (groupId, user) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        var member;
        for (let groupMemberId of user.userGroups) {
            const mbr = await GroupMember.findById(groupMemberId);
            if (mbr) {
                if (mbr.group == groupId) {
                    member = mbr;
                    break;
                }
            }
        }
        if (!member) throw ("Could not find Member");

        return member;

    } catch (error) {
        throw ("getMember " + error);
    }
}

const getGroupFeed = async (groupId) => {
    try {
        const groupData = await Group.findOne({ _id: groupId });
        if (!groupData) throw ("Could not find Group");

        const groupFeedData = await GroupFeed.findOne({ _id: groupData.groupFeed });

        var allPosts = [];
        if (groupFeedData.groupPosts.length > 0) {
            for (let i = 0; i < groupFeedData.groupPosts.length; i++) {

                const mbr = await GroupMember.findOne({ _id: groupFeedData.groupPosts[i].postCreatedBy });
                if (!mbr) throw ("Could not find Member");

                const user = await User.findOne({ _id: mbr.user });
                if (!user) throw ("Could not find User");

                let image;
                try {
                    if (user.userProfilePic.data) {
                        const locationImageResized = await sharp(user.userProfilePic.data)
                            .resize(100, 100)
                            .png()
                            .toBuffer();

                        image = locationImageResized.toString('base64');
                    } else {
                        image = '';
                    }
                } catch (error) {
                    image = '';
                }

                const post = {
                    postImage: groupFeedData.groupPosts[i]._doc.postImage.data.toString('base64'),
                    _id: groupFeedData.groupPosts[i]._doc._id,
                    postCaption: groupFeedData.groupPosts[i]._doc.postCaption,
                    postCreatedBy: groupFeedData.groupPosts[i]._doc.postCreatedBy,
                    postCreatedAt: groupFeedData.groupPosts[i]._doc.postCreatedAt,
                    userFirstName: user.userFirstName,
                    userLastName: user.userLastName,
                    userProfilePic: image
                }

                allPosts.push(post);
            }
        }

        return allPosts;
    } catch (error) {
        throw ("getGroupFeed " + error);
    }
}

const addPost = async (groupId, user, member, post) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        let bufferedImage = Buffer.from(post.postImage, 'base64');

        const postImageResized = await sharp(bufferedImage)
            .resize(640, 640)
            .png()
            .toBuffer();

        let newPost = {
            postImage: { data: postImageResized, contentType: "image/png" },
            postCaption: post.postCaption,
            postCreatedBy: member._id,
        }

        const mbr = await GroupMember.findById(member._id);
        if (!mbr) throw ("Could not find Member");

        const savedGroupFeed = await GroupFeed.findOneAndUpdate(
            { _id: groupData.groupFeed },
            { $push: { groupPosts: { $each: [newPost], $position: 0 } } },
            { new: true }).exec();

        // add post reference to the member
        mbr.groupMemberPosts.push(savedGroupFeed.groupPosts[0]._id);

        const groupFeed = await getGroupFeed(groupId);
        if (!groupFeed) throw ("Could not get group feed");

        return groupFeed;

    } catch (error) {
        throw ("addPost " + error);
    }
}

const updatepost = async (groupId, user, member, postId, updatedPost) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        const groupFeedData = await GroupFeed.findOne({ _id: groupData.groupFeed });

        var postIndex = -1;
        for (var i = 0; i < groupFeedData.groupPosts.length; i++) {
            if (groupFeedData.groupPosts[i]._id == postId) {
                postIndex = i;
                break;
            }
        }

        let postImageResized;
        let updatePostData;
        if (updatedPost.postImage) {
            let bufferedImage = Buffer.from(updatedPost.postImage, 'base64');

            postImageResized = await sharp(bufferedImage)
                .resize(640, 640)
                .png()
                .toBuffer();

            updatePostData = {
                postImage: { data: postImageResized, contentType: "image/png" },
                postCaption: updatedPost.postCaption,
            }

            groupFeedData.groupPosts[postIndex].postImage = updatePostData.postImage ? updatePostData.postImage : groupFeedData.groupPosts[postIndex].postImage;
            groupFeedData.groupPosts[postIndex].postCaption = updatePostData.postCaption ? updatePostData.postCaption : groupFeedData.groupPosts[postIndex].postCaption;
        } else {
            groupFeedData.groupPosts[postIndex].postCaption = updatedPost.postCaption ? updatedPost.postCaption : groupFeedData.groupPosts[postIndex].postCaption;
        }

        const savedGroupFeed = await groupFeedData.save();
        if (!savedGroupFeed) throw ("Could not save group feed");

        const groupFeed = await getGroupFeed(groupId);
        if (!groupFeed) throw ("Could not get group feed");

        return groupFeed;

    } catch (error) {
        throw ("updatepost " + error);
    }
}


const deletePost = async (groupId, postId) => {
    try {
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        const groupFeedData = await GroupFeed.findOne({ _id: groupData.groupFeed });

        groupFeedData.groupPosts = groupFeedData.groupPosts.filter(function (post) {
            return post._id != postId;
        });

        const savedGroupFeedData = await groupFeedData.save();
        if (!savedGroupFeedData) throw ("Could not save group feed");

        const groupFeed = await getGroupFeed(groupId);
        if (!groupFeed) throw ("Could not get group feed");

        return groupFeed;

    } catch (error) {
        throw ("updateChatMessage " + error);
    }
}


module.exports = () => {
    return {
        setupGroupFeedNamespace: async (groupId, io) => {
            try {
                // Setup GroupFeed NameSpace
                const nsp = io
                    .of('/groupFeed:' + groupId)
                    .on('connection', async (socket) => {
                        var userId;
                        var user;
                        var member;
                        var group;

                        socket.on('authenticate', async (data) => {
                            try {
                                console.log('Group Feed Authenticate')
                                userId = await verifyLoginToken(data.token);
                                if (!userId) {
                                    throw ("Could Not Verify Token");
                                }

                                group = data.groupId;
                                user = await getUser(userId);
                                if (!user) { throw ("Could Not find user"); }
                                member = await getMember(group, user);
                                if (!user) { throw ("Could Not find member"); }

                                const groupFeedData = await getGroupFeed(group);
                                console.log('Group Feed Sending Data');
                                if (groupFeedData.length > 0) {
                                    for (let feedData of groupFeedData) {
                                        socket.emit('authenticated', feedData);
                                    }
                                } else {
                                    socket.emit('authenticated', null);
                                }


                               /* console.log("ALL CONNECTIONS");
                                io.of('/groupFeed:' + groupId).clients((error, clients) => {
                                    if (error) throw error;
                                    console.log(clients); // => [Anw2LatarvGVVXEIAAAD] 
                                });*/

                            } catch (error) {
                                console.log(error)
                                socket.emit('unauthorized', '');
                            }
                        });

                        socket.on('new post', async (post) => {
                            try {
                                console.log('new post')
                                const groupFeed = await addPost(group, user, member, post);

                                for (let feedData of groupFeed) {
                                    nsp.emit('new post', feedData);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        });

                        socket.on('update post', async (postId, updatedPost) => {
                            try {
                                console.log('update post')
                                const groupFeed = await updatepost(group, user, member, postId, updatedPost);

                                for (let feedData of groupFeed) {
                                    nsp.emit('update post', feedData);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        });

                        socket.on('delete post', async (postId) => {
                            try {
                                console.log('delete post')
                                const groupFeed = await deletePost(group, postId);
                                nsp.emit('reset post data');
                                if (groupFeed.length > 0) {
                                    for (let feedData of groupFeed) {
                                        nsp.emit('delete post', feedData);
                                    }
                                } else {
                                    socket.emit('delete post', null);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        });

                        socket.on('update feed', async (data) => {
                            try {
                                const groupFeed = await getGroupFeed(group);
                                for (let feedData of groupFeed) {
                                    socket.emit('update feed', feedData);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        });

                        socket.on('disconnect', async (postId) => {
                            console.log('disconnect')
                        });
                    });

                return;

            } catch (error) {
                console.log("setupGroupFeed " + error)
            }
        }
    }
};
