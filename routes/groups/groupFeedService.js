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
        const groupData = await Group.findById(groupId);
        if (!groupData) throw ("Could not find Group");

        const groupFeedData = await GroupFeed.findOne({ _id: groupData.groupFeed });

        var allPosts = [];
        for (let post in groupFeedData.groupPosts) {

            const mbr = await GroupMember.findById(posts.postCreatedBy);
            if (!mbr) throw ("Could not find Member");

            const user = await User.findById(userId);
            if (!user) throw ("Could not find User")

            post = {
                ...post,
                userFirstName: user.userFirstName,
                userLastName: user.userLastName,
                userProfilePic: user.userProfilePic,
            }

            allPosts.push(post);
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

        const groupFeedData = await GroupFeed.findOne({ _id: groupData.groupFeed });

        const postImageResized = await sharp(post.postImage)
            .resize(1080, 1080)
            .png()
            .toBuffer();

        let newPost = {
            postImage: { data: postImageResized, contentType: "image/png" },
            postCaption: post.postCaption,
            postCreatedBy: member._id,
        }

        const mbr = await GroupMember.findById(member._id);
        if (!mbr) throw ("Could not find Member");

        groupFeedData.groupPosts.unshift(newPost);

        const savedGroupFeed = await groupFeedData.save();
        if (!savedGroupFeed) throw ("Could not save chat");

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

        let updatePostData = {
            postContent: updatedPost,
            postCreatedBy: member._id,
        }

        var postIndex = -1;
        for (var i = 0; i < chatRoom.groupPosts.length; i++) {
            if (chatRoom.groupPosts[i]._id == postId) {
                postIndex = i;
                break;
            }
        }

        groupFeedData.groupPosts[postIndex] = updatePostData ? updatePostData : groupFeedData.groupPosts[postIndex];

        const savedGroupFeed = await groupFeedData.save();
        if (!savedGroupFeed) throw ("Could not save chat");

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

        groupFeedData.groupPosts.pull(postId);

        const savedGroupChat = await groupChatData.save();
        if (!savedGroupChat) throw ("Could not save chat");

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

                        socket.on('authenticate', async (token) => {
                            try {
                                userId = await verifyLoginToken(token);
                                if (!userId) {
                                    throw ("Could Not Verify Token");
                                }

                                console.log('join group feed')
                                group = data.groupId;
                                user = await getUser(userId);
                                member = await getMember(group, user);

                                const groupFeed = await getGroupFeed(group);

                                nsp.emit('authenticated', groupFeed);
                            } catch (error) {
                                socket.emit('unauthorized', error);
                            }
                        });

                        socket.on('new post', async (post) => {
                            try {
                                console.log('new post')
                                const groupFeed = await addPost(group, user, member, post);
                                nsp.emit('new post', groupFeed);
                            } catch (error) {
                                throw (error);
                            }
                        });

                        socket.on('update post', async (postId, updatedPost) => {
                            try {
                                console.log('update post')
                                const groupFeed = await updatepost(group, user, member, postId, updatedPost);
                                socket.broadcast.emit('update post', groupFeed);
                            } catch (error) {
                                throw (error);
                            }
                        });

                        socket.on('delete post', async (postId) => {
                            try {
                                console.log('delete post')
                                const chatLog = await deletePost(group, user, member, postId);
                                socket.broadcast.emit('delete post', chatLog);
                            } catch (error) {
                                throw (error);
                            }
                        });
                    });

                return;

            } catch (error) {
                throw ("setupGroupFeed " + error)
            }
        }
    }
};
