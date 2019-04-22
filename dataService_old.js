const mongoose = require("mongoose");

const Restaurant = require('./models/restaurant');
const Cuisine = require('./models/cuisine');
const Mark = require('./models/mark');
const PriceRange = require('./models/priceRange');
const Review = require('./models/review');
const User = require('./models/user');
const Group = require('./models/group');

module.exports = () => {
  return {

    // ///// Function Outline! 
    // functionName: () => {
    //   return new Promise((resolve, reject) => {
    //     SchemaName.what()
    //     .then(data => {
    //       resolve(data)
    //     }).catch(err => {
    //       reject(err)
    //     });
    //   });
    // },

    getRestaurants: () => {
      return new Promise((resolve, reject) => {
        Restaurant.find()
        .then(data => {
          console.log('data retrieved?', data)
          resolve(data)
        }).catch(err => {
          console.log('ERROROROOR')
          reject(err)
        });
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
            if (data) {
              console.log('search result: ', data)
              resolve(data)
            } else reject('no restaurant with specified id')
          })
          .catch(err => {
            console.log('fail')
            reject(err)
        });

      });
    },

    //check groupid exists first?

    //PREVENT ADDING DUPLICATE??
    addRestaurant: (restuarantData) => {
      return new Promise((resolve, reject) => {

        let { groupId, geometry, restaurantName, restaurantLocation, userId } = restuarantData
        if (!(groupId || geometry || restaurantName || restaurantLocation || userId)) { // check if group id is valid
          reject({"error": "missing fields, need groupId, geometry, restaurantName, restaurantLocation, userId"})
          return;
        }
        if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId)) {
          reject({"error": "either groupId or userId cannot be converted to valid ObjectId"})
        }

        console.log(groupId)
        console.log('body data: ', restuarantData)
        let refId = ''

        Mark.create({ 
          locationId: new mongoose.Types.ObjectId(),
          groupId,
          geometry
        }).then(data => {
          console.log('returned from mark', data)
          refId = data.id // later populated via id!
          console.log('ID to use: ', data.locationId)

          Restaurant.create({
            ...restuarantData,
            locationId: data.locationId
          }).then(data => {
            console.log('returned from restaurant: ', data)

            // if (groupId) {

              Group.findByIdAndUpdate(
                groupId,
                { $push: { groupMarks: refId } },//data.locationId
                { runValidators: true }
              ).then(data => {
                console.log('returned from adding marker to group, if null then group d.n.e', data)
              }).catch(err => {
                console.log('couldnt add marker to group')
                reject(err)
              })

            // } else {
            //   reject("mark and restuarant, but not added to group")
            //   return;
            // }

            console.log('resolving!')
            resolve(data)
          }).catch(err => {
            console.log(4, err)
            reject(err)
          });
        }).catch(err => {
          console.log(3)
          reject(err)
        });
      })
    },


    // delete restaurant and corresponding mark
    deleteRestaurantById: (locationId) => {
      return new Promise((resolve, reject) => {
        let errorMessage = ''
        let restaurantDeleted = false
        let markDeleted = false

        // delete restaurant
        Restaurant.deleteOne({ locationId })
          .exec()
          .then(data => {
            console.log("restaraunt deleted count: ", data.deletedCount)

            if (data.deletedCount === 1) {
              restaurantDeleted = true
            }

            // delete mark
            Mark.deleteOne({ locationId })
              .exec()
              .then(data => {
                console.log('mark deleted count: ', data.deletedCount)
                if (data.deletedCount === 1) {
                  markDeleted = true
                  if (restaurantDeleted) resolve({'success': 'restuarant and mark deleted'})
                  ///////////////DELETE MARKER OID FROM GROUPMARKERS ARRAY, delete all corresponding reviews////////////
                  else errorMessage = 'mark deleted, restaurant with specified id does not exist'
                } else {
                  if (restaurantDeleted) errorMessage = 'restuarant deleted, mark with specified id does not exist'
                  else errorMessage = 'no mark or restaurant with specified id'
                }
                reject(errorMessage)
              })
              .catch(err => {
                console.log('fail')
                reject(err.message)
            });

          }).catch(err => {
            console.log('failed?')
            reject(err.message)
          });
      })
    },

    updateRestaurantById: (locationId, newData) => {
      return new Promise((resolve, reject) => {
        console.log('running?')

        Restaurant.findOneAndUpdate({ locationId }, newData, {runValidators:true}).then((data) => {
          console.log('successfull update, this is old: ', data);
          resolve(data)
        }).catch(err => {
          console.log('problem??', err.message)
          reject(err.message)
        });

      })
    },

    //get reviews for specific restauarant
    getAllReviews: () => {
      return new Promise((resolve, reject) => {
        Review.find()
        .then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        });
      })
    },

    getReviewsByRestaurant: (reqBody) => {
      return new Promise((resolve, reject) => {

        let { locationId } = reqBody
        if (!locationId) {
          reject({"error": "include locationId in body"})
          return;
        }

        Restaurant.findOne({locationId}).populate("restaurantReviews").then(data => {
          if (data) {
            console.log('restaurantReviews', data.restaurantReviews)
            resolve(data)
          } else reject({"error": "no restaurant with specified id"})
        }).catch(err => {
          console.log('error', err)
          reject(err)
        });

      });
    },
    
    addReview: (reviewData) => {
      return new Promise((resolve, reject) => {
        console.log('body data: ', reviewData)

        // format creation body first?
        // check if provided userId/restaurantId is valid first?
        Review.create({
          ...reviewData
        }).then(data => {
          console.log('returned from review creation', data, data.id)

          Restaurant.findOneAndUpdate(
            { locationId: data.restaurantId },
            { $push: { restaurantReviews: data.id } },//data.locationId
            { runValidators: true }
          ).then(data => {
            console.log('returned from adding review to restaurant', data)
            resolve(data)
          }).catch(err => {
            console.log('couldnt add review to restuarant')
            reject(err)
          })

        }).catch(err => {
          reject(err)
        });
      })
    },

    updateReviewById: (reviewId, newReview) => {
      return new Promise((resolve, reject) => {

        // check if restaurant&user id match! then update. otherwise throw error

        // Review.pre('validate', function(next) {
        //   console.log("WOOOOO")
        //   if (self.isModified('_createdOn')) {
        //       self.invalidate('_createdOn');
        //   }
        // });

        if (!mongoose.Types.ObjectId.isValid(newReview.restaurantId) ||
            !mongoose.Types.ObjectId.isValid(newReview.reviewUser.userId)) {

          reject("invalid restaurant or user Id")
        }

        Review.findById(reviewId).then(doc => {
          if (!doc) {
            reject({"error": "review doesn't exist"}) //TURN INTO 404????????????
          } else {
            console.log("OLD DOC:", doc)
            console.log("NEW DOC:", newReview)
            if (!( doc.restaurantId.toString() === newReview.restaurantId ) ||
                !( doc.reviewUser.userId.toString() === newReview.reviewUser.userId)) {

              reject("cannot update restaurant or user Id")
            } else {
              doc.reviewContent = newReview.reviewContent
              doc.reviewRating = newReview.reviewRating
              doc.save().then(data => {
                resolve({"success": data})
              }).catch(err => {
                reject(err)
              })
            }
          }
        }).catch(err => reject(err))
        // Review.findByIdAndUpdate(reviewId, newReview, {runValidators: true}).then(data => {
        //   if (data) {
        //     console.log('review delete results:', data)
        //     resolve({'success': 'review updated'})
        //   } else reject('no review with specified id')
        // }).catch(err => {
        //   reject(err)
        // })
      })
    },

    deleteReviewById: (id) => {
      return new Promise((resolve, reject) => {

        Review.findByIdAndDelete(id).then(data => {
          if (data) {
            console.log('review delete results:', data)
            resolve({'success': 'review deleted'})
          } else reject('no review with specified id')
        }).catch(err => {
          console.log('fail')
          reject(err.message)
        });

      })
    },

    getMarks: (reqQuery) => {
      return new Promise((resolve, reject) => {

        let { groupId, lat, lng } = reqQuery
        if (!groupId) {
          reject({"error": "include groupId in query"})
          return;
        }

        if (!lat || !lng) {
        //////////////////////////////////////
        // WHY NOT MARK.FIND({ groupId })? (add groupid field in addRestaurant in dataService)
        Group.findById(groupId).populate("groupMarks").then(data => {
          console.log('newdata', data)
          // return 404 if null!-todo
          console.log('groupmarkers', data.groupMarks)
          resolve(data)
        }).catch(err => {
          console.log('error', err)
          reject(err)
        });

        // Mark.find({ groupId })
        // .then(data => {
        //   resolve(data)
        // }).catch(err => {
        //   console.log('ERROROROOR')
        //   reject(err)
        // });
        //////////////////////////////////////////////
      } else {
        ////////////////////////////////////////
        coordinates = [
          parseFloat(reqQuery.lat),
          parseFloat(reqQuery.lng)
        ]
        console.log(coordinates)
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
          {$match: { groupId: mongoose.Types.ObjectId(groupId) }}
        ]).then(data => {
          console.log('got nearest')
          resolve(data)
        }).catch(err => {
          console.log('error fetching nearest')
          reject(err)
        })
        /////////////////////////////////////////
      }

      });
    },

    // configurable maxDistance?
    getNearestMarks: (reqQuery) => {
      return new Promise((resolve, reject) => {
        coordinates = [
          parseFloat(reqQuery.lat),
          parseFloat(reqQuery.lng)
        ]
        Mark.aggregate().near({
          near: {
            type: "Point",
            coordinates
          },
          maxDistance: 100000,
          spherical: true,
          distanceField: "dis"
        }).then(data => {
          console.log('got nearest')
          resolve(data)
        }).catch(err => {
          console.log('error fetching nearest')
          reject(err)
        })
      })
    },

    getUsers: () => {
      return new Promise((resolve, reject) => {
        User.find()
        .then(data => {
          console.log('data retrieved?', data)
          resolve(data)
        }).catch(err => {
          console.log('ERROROROOR')
          reject(err)
        });
      });
    },
    
    addUser: (userData) => {
      return new Promise((resolve, reject) => {
        console.log('new user data: ', userData)

        // format creation body first?
        // create. if exists, return error? currently email can't be duplicate
        User.create({
          ...userData
        }).then(data => {
          console.log('userId: ', data.userId)
          resolve(data)
        }).catch(err => {
          reject(err)
        });
      })
    },
    
    getUserById: (userId) => {
      return new Promise((resolve, reject) => {
        console.log(userId)
        User.findById(userId)
          .then(data => {
            if (data) resolve(data)
            else reject('no user with specified id')
          })
          .catch(err => {
            console.log('fail')
            reject(err)
        });
      });
    },
    
    getGroups: () => {
      return new Promise((resolve, reject) => {
        Group.find().populate("groupMarks")
        .then(data => {
          console.log('data retrieved?', data)
          resolve(data)
        }).catch(err => {
          console.log('ERROROROOR')
          reject(err)
        });
      });
    },
    
    addGroup: (groupData) => {
      return new Promise((resolve, reject) => {
        console.log('new groupData: ', groupData)

        // format creation body first?
        // create. if exists, return error?
        Group.create({
          ...groupData
        }).then(data => {
          console.log('groupId: ', data.groupId)
          resolve(data)
        }).catch(err => {
          console.log(err)
          reject(err)
        });
      })
    },




  }
}