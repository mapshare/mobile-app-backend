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
        getMarks: (reqQuery) => {
            return new Promise((resolve, reject) => {

                let { groupId, lat, lng, userId } = reqQuery

                if (!groupId) {
                    reject({ "error": "include groupId in query" })
                    return;
                }

                Group.findById(groupId)
                    .then(data => {
                        if (!userId in data.groupMembers) {
                            reject("user is not part of this group")
                            return
                        }

                        if (!lat || !lng) {

                            // WHY NOT MARK.FIND({ groupId })? (add groupid field in addRestaurant in dataService)
                            // Group.findById(groupId)
                            // .populate("groupMarks")
                            // .then(data => {
                            //   console.log('newdata', data)
                            //   // return 404 if null!-todo
                            //   console.log('groupmarkers', data.groupMarks)
                            //   resolve(data)
                            // })
                            // .catch(err => reject({"cannot populate??": err}))

                            Group.aggregate([
                                {
                                    $match: { _id: mongoose.Types.ObjectId(groupId) }
                                },
                                { $lookup: { from: 'marks', localField: 'groupMarks', foreignField: '_id', as: 'expandedMarks' } },
                                {
                                    $project: {
                                        "expandedMarks.groupMembers": 0,
                                        "expandedMarks.groupName": 0,
                                        "expandedMarks.groupId": 0,
                                        "expandedMarks.geometry._id": 0,
                                        "expandedMarks._id": 0,
                                        "expandedMarks.__v": 0
                                    }
                                },
                            ])
                                .then(data => {
                                    resolve(data[0].expandedMarks)
                                    // // either keep below, or (lookup and project)
                                    // Mark.populate(data[0],{path: "groupMarks"})
                                    // .then(data => {console.log(data.groupMarks.length);resolve(data.groupMarks)})
                                    // .catch(err => reject(err))
                                })
                                .catch(err => { console.log(err); reject(err) })

                        } else {
                            ////////////////////////////////////////
                            coordinates = [
                                parseFloat(lat),
                                parseFloat(lng)
                            ]

                            Mark.aggregate([
                                {
                                    $geoNear: {
                                        near: {
                                            type: "Point",
                                            coordinates
                                        },
                                        maxDistance: 100000,
                                        spherical: true,
                                        distanceField: "distance"
                                    }
                                },
                                {
                                    $match: {
                                        groupId: mongoose.Types.ObjectId(groupId)
                                    }
                                },
                                {
                                    $project: {
                                        groupId: 0,
                                        _id: 0,
                                        "geometry._id": 0,
                                        __v: 0
                                    }
                                },
                            ])
                                .then(data => resolve(data))
                                .catch(err => reject(err))
                            /////////////////////////////////////////
                        }

                    }).catch(err => reject(err));
            });
        },

        getMarksByPriceRange: (reqQuery) => {
            return new Promise((resolve, reject) => {
                let { groupId, lat, lng, userId, priceRange } = reqQuery

                Group.findById(groupId)
                    //.populate('groupMarks')
                    .then(data => {
                        if (!userId in data.groupMembers) {
                            reject("user is not part of this group")
                            return
                        }

                        if (!lat || !lng) {
                            reject("provide lat and lng?")
                            return
                        }

                        let coordinates = [
                            parseFloat(lat),
                            parseFloat(lng)
                        ]

                        Mark.aggregate([
                            {
                                $geoNear: {
                                    near: {
                                        type: "Point",
                                        coordinates
                                    },
                                    maxDistance: 100000,
                                    spherical: true,
                                    distanceField: "distance"
                                }
                            },
                            {
                                $lookup: {
                                    from: "restaurants",
                                    localField: "locationId",
                                    foreignField: "locationId",
                                    as: "Restaurant"
                                }
                            },
                            {
                                $match: {
                                    groupId: mongoose.Types.ObjectId(groupId),
                                    "Restaurant.restaurantPriceRange": priceRange
                                }
                            },
                            {
                                $project: {
                                    Restaurant: 0,
                                    groupId: 0,
                                    _id: 0,
                                    "geometry.type": 0,
                                    __v: 0
                                }
                            }
                        ])
                            .then(agResult => {
                                resolve(agResult)
                            })
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err))
            })
        },
        // // configurable maxDistance?
        // getNearestMarks: (reqQuery) => {
        //   return new Promise((resolve, reject) => {
        //     coordinates = [
        //       parseFloat(reqQuery.lat),
        //       parseFloat(reqQuery.lng)
        //     ]
        //     Mark.aggregate().near({
        //       near: {
        //         type: "Point",
        //         coordinates
        //       },
        //       maxDistance: 100000,
        //       spherical: true,
        //       distanceField: "dis"
        //     }).then(data => {
        //       console.log('got nearest')
        //       resolve(data)
        //     }).catch(err => {
        //       console.log('error fetching nearest')
        //       reject(err)
        //     })
        //   })
        // }
    }
}