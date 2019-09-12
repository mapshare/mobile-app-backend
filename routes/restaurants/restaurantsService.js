const mongoose = require("mongoose");
const Restaurant = require('../../models/restaurant');
const Cuisine = require('../../models/cuisine');
const Group = require('../../models/group');
const PriceRange = require('../../models/priceRange');
const Mark = require('../../models/mark');
const Review = require('../../models/review');
const User = require('../../models/user');

module.exports = () => {
    return {
        getRestaurants: () => {
            return new Promise((resolve, reject) => {

                Restaurant.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        getRestaurantById: (locationId) => {
            return new Promise((resolve, reject) => {

                // validate location ******ADD ! TO IMPLEMENT******
                // if (locationId.match(/^[0-9a-fA-F]{24}$/)) {
                //   reject('invalid id')
                // }

                Restaurant.findOne({ locationId })
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no restaurant with specified id')
                    })
                    .catch(err => {
                        reject(err)
                    });

            });
        },

        //check groupid exists first?

        //PREVENT ADDING DUPLICATE??
        addRestaurant: (restaurantData) => {
            return new Promise((resolve, reject) => {

                let { groupId, geometry, restaurantName, restaurantLocation, userId, priceRange } = restaurantData

                if (!(groupId && geometry && restaurantName && restaurantLocation && userId && priceRange)) {
                    reject({ "error": "missing fields, need groupId, geometry, restaurantName, restaurantLocation, userId, priceRange" })
                    return;
                }

                if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId)) {
                    reject({ "error": "either groupId or userId cannot be converted to valid ObjectId" })
                    return
                }

                // validate priceRange here if required, such that new mark wont be created
                if (priceRange.split('').some(char => { return (char !== "$") }) || ![1, 2, 3].includes(priceRange.length)) {
                    reject({ "error": "invalid priceRange" })
                    return
                }

                Group.findById(groupId).then(doc => {
                    if (!doc) {
                        reject({ "error": "group doesn't exist" }) //cannot complete operation code?
                    } else if (!doc.groupMembers.some(id => { return id.equals(userId) })) {
                        reject({ "error": "user doesn't belong to group" })
                    } else {

                        let refId = ''

                        Mark.create({
                            locationId: new mongoose.Types.ObjectId(),
                            groupId,
                            geometry
                        })
                            .then(data => {
                                console.log('returned from mark', data)
                                refId = data.id // later populated via id!
                                console.log('ID to use: ', data.locationId)

                                Restaurant.create({
                                    ...restaurantData,
                                    restaurantPriceRange: priceRange,
                                    locationId: data.locationId
                                })
                                    .then(data => {
                                        console.log('returned from restaurant: ', data)

                                        // add restaurant to PriceRange collection
                                        if (priceRange) {
                                            PriceRange.findOne({ priceRange })
                                                .then(rangeData => {
                                                    if (rangeData) {
                                                        console.log('range already exists')
                                                        rangeData.restaurantList.push(data.locationId)
                                                        rangeData.save()
                                                            .then(newrangedata => {
                                                                console.log('new price range data', newrangedata)
                                                            })
                                                            .catch(err => console.log("new price range error", err))
                                                    } else {
                                                        console.log('range doesnt exist yet')
                                                        PriceRange.create({
                                                            priceRange,
                                                            restaurantList: [data.locationId]
                                                        })
                                                            .then(newrangedata => {
                                                                console.log('new price range data', newrangedata)
                                                            })
                                                            .catch(err => console.log("new price range error", err))
                                                    }
                                                })
                                                .catch(err => console.log('couldnt find priceRange?', err))
                                            // PriceRange.findOneAndUpdate(
                                            //   { priceRange },
                                            //   { $push: { restaurantList: refId } },
                                            //   { runValidators: true }
                                            // )
                                            // .then(priceData => {
                                            //   console.log('priceData: ', priceData)
                                            // })
                                            // .catch(err => {
                                            //   console.log('price add error: ', err)
                                            // })
                                        }

                                        doc.groupMarks.push(refId)

                                        doc.save()
                                            .then(groupData => {
                                                console.log('returned from adding marker&user to group', groupData)
                                                resolve(data) // restaurantData
                                            })
                                            .catch(err => {
                                                console.log('couldnt add marker/user to group')
                                                reject(err)
                                            })

                                    })
                                    .catch(err => reject(err));

                            })
                            .catch(err => reject(err));

                    }
                })
                    .catch(err => reject(err))
            })
        },


        // delete restaurant and corresponding mark
        deleteRestaurantById: (locationId, reqBody) => {
            return new Promise((resolve, reject) => {

                if (!reqBody.userId) {
                    reject("provide userId")
                    return
                }

                Restaurant.findOne({ locationId }).populate('groupId')
                    .then(restaurantData => {
                        console.log('restaurantData: ', restaurantData)

                        if (!restaurantData) {
                            reject("restaurant doesn't exist") //error code?
                            return
                        }
                        if (!restaurantData.groupId.groupMembers.some(id => { return id.equals(reqBody.userId) })) {
                            reject("user does not belong to this restaurant's group")
                            return
                        }

                        // delete mark, reviews, mark from groupmarks

                        Mark.deleteOne({ locationId })
                            .then(markData => {
                                console.log('markData: ', markData)
                            })
                            .catch(err => {
                                console.log("error deleting markData", err)
                            })

                        Review.deleteMany({ locationId })
                            .then(reviewData => {
                                console.log('reviewData: ', reviewData)
                            })
                            .catch(err => {
                                console.log("error deleting reviewData", err)
                            })

                        PriceRange.findOne({ priceRange: restaurantData.restaurantPriceRange })
                            .then(rangeData => {
                                rangeData.restaurantList.splice(rangeData.restaurantList.indexOf(locationId), 1)
                                rangeData.save()
                                    .catch(err => console.log("err", err))
                            })
                            .catch(err => {
                                console.log("error deleting id from priceRange collection", err)
                            })

                        Group.updateOne(
                            { _id: restaurantData.groupId },
                            { $pull: { groupMarks: locationId } }
                        )
                            .then(groupData => {
                                console.log("updated group? ", groupData)
                            })
                            .catch(err => {
                                console.log('failed to update group', err)
                            })

                        restaurantData.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err))

                    })
                    .catch(err => reject(err))

            })
        },

        updateRestaurantById: (locationId, newData) => {
            return new Promise((resolve, reject) => {

                let { userId, restaurantName, restaurantLocation, priceRange, groupId } = newData

                if (!(userId && groupId)) {
                    reject("body requires userId and groupId")
                    return
                }
                if (!(mongoose.Types.ObjectId.isValid(locationId) &&
                    mongoose.Types.ObjectId.isValid(userId))) {
                    reject("provide valid userId in body, valid locationId in URL")
                    return
                }

                Restaurant.findOne({ locationId })
                    .then(doc => {

                        if (!doc) {
                            reject("restaurant doesn't exist") //TURN INTO 404????????????
                            return
                        }

                        console.log("OLD DOC:", doc)
                        console.log("NEW DOC:", newData)

                        if (newData.locationId || newData.restaurantReviews || newData.geometry) {
                            reject("cannot update restaurant locationId, reviews, or geometry")
                        } else {
                            Group.findById(doc.groupId)
                                .then(groupData => {
                                    if (groupData.groupMembers.some(id => { return id.equals(userId) })) {

                                        if (priceRange && priceRange !== doc.restaurantPriceRange) {

                                            PriceRange.findOne({ priceRange })
                                                .then(rangeData => {
                                                    rangeData.restaurantList.push(locationId)
                                                    rangeData.save()
                                                        .catch(err => console.log("err", err))
                                                })
                                                .catch(err => console.log("err", err))

                                            PriceRange.findOne({ priceRange: doc.restaurantPriceRange })
                                                .then(rangeData => {
                                                    rangeData.restaurantList.splice(rangeData.restaurantList.indexOf(locationId), 1)
                                                    rangeData.save()
                                                        .catch(err => console.log("err", err))
                                                })
                                                .catch(err => console.log("err", err))

                                        }

                                        doc.restaurantName = restaurantName ? restaurantName : doc.restaurantName
                                        doc.restaurantLocation = restaurantLocation ? restaurantLocation : doc.restaurantLocation
                                        doc.restaurantPriceRange = priceRange ? priceRange : doc.restaurantPriceRange

                                        doc.save()
                                            .then(data => { resolve({ "success": data }) })
                                            .catch(err => reject(err))

                                    } else {
                                        reject("user does not belong to this restaurant's group")
                                    }

                                })
                                .catch(err => reject(err))

                        }
                    }).catch(err => reject(err))

            })
        }
    }
}