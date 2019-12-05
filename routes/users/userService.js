const mongoose = require("mongoose");
const User = require("../../models/user");
const GroupMember = require("../../models/groupMember");
const Group = require("../../models/group");
const bcrypt = require("bcryptjs");
const sharp = require('sharp');

module.exports = () => {
	return {
		getUsers: () => {
			return new Promise((resolve, reject) => {
				User.find()
					.then(data => resolve(data))
					.catch(err => reject(err));
			});
		},

		addUser: userData => {
			return new Promise((resolve, reject) => {
				let newUser = null;

				if (userData.googleId) {
					newUser = new User({
						...userData
					});
				}

				newUser
					.save()
					.then(data => resolve(data))
					.catch(err => reject(err));
			});
		},

		processUser: userData => {
			return new Promise((resolve, reject) => {
				let {
					userEmail,
					userFirstName,
					userLastName,
					googleId,
					userImages
				} = userData;
				console.log(userData);

				if (!(userEmail && userFirstName && userLastName && googleId)) {
					reject({
						error:
							"please provide userEmail, userFirstName, userLastName, googleId"
					});
					return;
				}

				User.findOne({ googleId })
					.then(data => {
						if (data) {
							resolve(data);
						} else {
							User.create({
								userEmail,
								userFirstName,
								userLastName,
								googleId,
								userImages: userImages
							})
								.then(data => {
									console.log("new user created");
									resolve(data);
								})
								.catch(err => {
									reject(err);
									console.log(err);
								});
						}
					})
					.catch(err => reject(err));
			});
		},

		getUserById: userId => {
			return new Promise((resolve, reject) => {
				User.findById(userId)
					.populate("userGroups")
					.then(data => {
						if (data) resolve(data);
						else reject("no user with specified id");
					})
					.catch(err => reject(err));
			});
		},


		comparePassword: async (userId, oldPassword) => {
			try {
				// Get User From Database
				let userData = User.findById(userId);
				if (!userData) { throw ("User Not Found"); }

				// Verify if password is correct
				const validPassword = await bcrypt.compare(
					oldPassword,
					userData.userPassword
				);
				if (!validPassword) { throw ("Password does not match"); }

				return validPassword;

			} catch (error) {
				throw ("comparePassword: " + error);
			}
		},

		updateUserById: async (userId, newData) => {
			try {
				// Parse New Data
				let {
					userEmail,
					userFirstName,
					userLastName,
					userProfilePic,
					userPassword
				} = newData;

				// Get User From Database
				let user = await User.findById(userId);
				if (!user) { throw ("User Not Found") }

				user.userEmail = userEmail ? userEmail : user.userEmail;
				user.userFirstName = userFirstName ? userFirstName : user.userFirstName;
				user.userLastName = userLastName ? userLastName : user.userLastName;

				// Update User Profile Picture
				if (userProfilePic) {
					let buffer = Buffer.from(userProfilePic, 'base64');

					const imageResized = await sharp(buffer)
						.resize(640, 640)
						.png()
						.toBuffer();

					const userProfilePicdata = {
							data: imageResized,
							contentType: 'image/png'
					}

					user.userProfilePic = userProfilePicdata;
				}
				// Update User Password
				if (userPassword) {
					const salt = await bcrypt.genSalt(10);
					const newHashPassword = await bcrypt.hash(userPassword, salt);
					user.userPassword = newHashPassword ? newHashPassword : user.userPassword;
				}

				let updateUser = await User.findOneAndUpdate(
					{ _id: user._id },
					user,
					{ new: true }
				).exec();
				if (!updateUser) { throw ("Problem Updating User") }

				return true;
			} catch (error) {
				throw ("updateUserById: " + error);
			}
		},
		deleteUserbyId: id => {
			return new Promise((resolve, reject) => {
				User.findById(id)
					.then(userData => {
						if (!userData) {
							reject("User doesn't exist");
							return;
						}

						// Remove Group Reference to GroupMember
						GroupMember.find({ user: userData._id }).exec(function (err, data) {
							if (data) {
								data.forEach(groupMember => {
									Group.findOneAndUpdate(
										{ _id: groupMember.group },
										{ $pull: { groupMembers: groupMember._id } },
										{ new: true }
									)
										.then(data => { })
										.catch(err => reject(err));
								});
								// Remove GroupMember referencing User
								GroupMember.deleteMany({ user: userData._id })
									.then(data => { })
									.catch(err => reject(err));
							}
						});

						User.findByIdAndDelete(userData._id)
							.then(data => resolve(data))
							.catch(err => reject(err));
					})
					.catch(err => reject(err));
			});
		}
	};
};
