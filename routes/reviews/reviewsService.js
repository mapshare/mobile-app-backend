const mongoose = require("mongoose");
const Restaurant = require('../../models/restaurant');
const Group = require('../../models/group');
const Mark = require('../../models/mark');
const Review = require('../../models/review');
const User = require('../../models/user');

module.exports = () => {
    return {
        //get reviews for specific restauarant
        getAllReviews: () => {
            return new Promise((resolve, reject) => {
                Review.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            })
        },

        getReviewsByRestaurant: (reqQuery) => {
            return new Promise((resolve, reject) => {
                let { locationId } = reqQuery

                if (!locationId) {
                    reject({ "error": "include locationId in query" })
                    return;
                }

                Restaurant.aggregate([
                    {
                        $match: { locationId: mongoose.Types.ObjectId(locationId) }
                    },
                    { $lookup: { from: 'reviews', localField: 'restaurantReviews', foreignField: '_id', as: 'restaurantReviews' } },
                    {
                        $project: {
                            groupId: 0,
                            _id: 0,
                            __v: 0,
                            "restaurantReviews.locationId": 0,
                            "restaurantReviews.__v": 0
                        }
                    }
                ])
                    .then(data => {
                        if (data.length === 1) {
                            resolve(data[0])
                        } else {
                            reject({ "error": "locationId doesn't exist" })
                        }

                    })
                    .catch(err => reject(err))

                // Restaurant.findOne({ locationId })
                // .populate("restaurantReviews")
                // .then(data => {
                //   if (data) {
                //     console.log('restaurantReviews', data.restaurantReviews)
                //     resolve(data)
                //   } else {
                //     reject({"error": "no restaurant with specified id"})
                //   }
                // })
                // .catch(err => reject(err));

            });
        },

        addReview: (reviewData) => {
            return new Promise((resolve, reject) => {
                let { locationId, reviewUser } = reviewData

                if (!(locationId && reviewUser && reviewUser.userId)) {
                    reject("include locationId, reviewUser, and reviewUser.userId")
                    return
                }

                Restaurant.findOne({ locationId })
                    .populate("groupId")
                    .then(doc => {
                        if (!doc) {
                            reject("restaurant doesn't exist")
                            return
                        } else if (!doc.groupId.groupMembers.some(id => { return id.equals(reviewData.reviewUser.userId) })) {
                            reject("user doesn't belong to group")
                            return
                        }

                        // review only created if user in group
                        Review.create({ ...reviewData, createdAt: Date.now() })
                            .then(reviewData => {
                                console.log('returned from review creation', reviewData)
                                doc.restaurantReviews.push(reviewData.id)

                                doc.save()
                                    .then(d => {
                                        console.log('returned from adding review to restaurant', d)
                                        resolve(reviewData)
                                    })
                                    .catch(err => {
                                        console.log('couldnt add review to restuarant')
                                        reject(err)
                                    })

                            })
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err))
            })
        },

        updateReviewById: (reviewId, newReview) => {
            return new Promise((resolve, reject) => {

                let { locationId, reviewUser, reviewContent, reviewRating } = newReview

                if (!(locationId && reviewContent && reviewRating && reviewUser && reviewUser.userId)) {
                    reject("include locationId, reviewContent, reviewRating, reviewUser, and reviewUser.userId")
                    return
                }
                else if (!(mongoose.Types.ObjectId.isValid(locationId) &&
                    mongoose.Types.ObjectId.isValid(reviewUser.userId))) {
                    reject("provide valid locationId and userId")
                    return
                }

                Review.findById(reviewId)
                    .then(doc => {

                        if (!doc) {
                            reject("review doesn't exist") //TURN INTO 404????????????
                            return
                        }

                        console.log("OLD DOC:", doc)
                        console.log("NEW DOC:", newReview)

                        if (!(doc.locationId.toString() === newReview.locationId) ||
                            !(doc.reviewUser.userId.toString() === newReview.reviewUser.userId)) {

                            reject("cannot update restaurant or user Id")
                        }
                        else {
                            doc.reviewContent = newReview.reviewContent
                            doc.reviewRating = newReview.reviewRating
                            doc.updatedAt = Date.now()

                            doc.save()
                                .then(data => resolve({ "success": data }))
                                .catch(err => reject(err))
                        }
                    })
                    .catch(err => reject(err))
            })
        },

        deleteReviewById: (id) => {
            return new Promise((resolve, reject) => {

                // USER PERMISSIONS???
                Review.findByIdAndDelete(id).then(data => {
                    if (data) {
                        console.log('review delete results:', data)
                        resolve({ 'success': 'review deleted' })
                    } else reject('no review with specified id')
                }).catch(err => {
                    console.log('fail')
                    reject(err.message)
                });

            })
        }
    }
}