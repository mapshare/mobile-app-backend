const mongoose = require("mongoose");
const Location = require("../../models/location");
const Group = require("../../models/group");
const PriceRange = require("../../models/priceRange");
const Mark = require("../../models/mark");
const Review = require("../../models/review");
const User = require("../../models/user");

module.exports = () => {
  return {
    getLocations: () => {
      return new Promise((resolve, reject) => {
        Location.find()
          .then(data => resolve(data))
          .catch(err => reject(err));
      });
    },

    getLocationById: locationId => {
      return new Promise((resolve, reject) => {
        // validate location ******ADD ! TO IMPLEMENT******
        // if (locationId.match(/^[0-9a-fA-F]{24}$/)) {
        //   reject('invalid id')
        // }

        Location.findOne({ locationId })
          .then(data => {
            if (data) resolve(data);
            else reject("no Location with specified id");
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    //check groupid exists first?

    //PREVENT ADDING DUPLICATE??
    addLocation: locationData => {
      return new Promise((resolve, reject) => {
        let {
          groupId,
          geometry,
          locationName,
          locationAddress,
          userId,
          priceRange
        } = locationData;

        if (
          !(
            groupId &&
            geometry &&
            locationName &&
            locationAddress &&
            userId &&
            priceRange
          )
        ) {
          reject({
            error:
              "missing fields, need groupId, geometry, locationName, locationAddress, userId, priceRange"
          });
          return;
        }

        if (
          !mongoose.Types.ObjectId.isValid(groupId) ||
          !mongoose.Types.ObjectId.isValid(userId)
        ) {
          reject({
            error:
              "either groupId or userId cannot be converted to valid ObjectId"
          });
          return;
        }

        // validate priceRange here if required, such that new mark wont be created
        if (
          priceRange.split("").some(char => {
            return char !== "$";
          }) ||
          ![1, 2, 3].includes(priceRange.length)
        ) {
          reject({ error: "invalid priceRange" });
          return;
        }

        Group.findById(groupId)
          .then(doc => {
            if (!doc) {
              reject({ error: "group doesn't exist" }); //cannot complete operation code?
            } else if (
              !doc.groupMembers.some(id => {
                return id.equals(userId);
              })
            ) {
              reject({ error: "user doesn't belong to group" });
            } else {
              let refId = "";

              Location.create({
                locationId: new mongoose.Types.ObjectId(),
                ...locationData
              })
                .then(data => {
                  console.log("returned from location: ", data);
                  refId = data.id; // later populated via id!
                  console.log("ID to use: ", data.locationId);

                  Mark.create({
                    locationId: data.locationId,
                    groupId,
                    geometry
                  });

                  doc.groupMarks.push(refId);

                  doc
                    .save()
                    .then(groupData => {
                      console.log(
                        "returned from adding marker&user to group",
                        groupData
                      );
                      resolve(data); // LocationData
                    })
                    .catch(err => {
                      console.log("couldnt add marker/user to group");
                      reject(err);
                    });
                })
                .catch(err => reject(err));
            }
          })
          .catch(err => reject(err));
      });
    },

    // delete Location and corresponding mark
    // TODO: not tested!
    deleteLocationById: (locationId, reqBody) => {
      return new Promise((resolve, reject) => {
        if (!reqBody.userId) {
          reject("provide userId");
          return;
        }

        Location.findOne({ locationId })
          .populate("groupId")
          .then(LocationData => {
            console.log("LocationData: ", LocationData);

            if (!LocationData) {
              reject("Location doesn't exist"); //error code?
              return;
            }
            if (
              !LocationData.groupId.groupMembers.some(id => {
                return id.equals(reqBody.userId);
              })
            ) {
              reject("user does not belong to this Location's group");
              return;
            }

            // delete mark, reviews, mark from groupmarks

            Mark.deleteOne({ locationId })
              .then(markData => {
                console.log("markData: ", markData);
              })
              .catch(err => {
                console.log("error deleting markData", err);
              });

            Review.deleteMany({ locationId })
              .then(reviewData => {
                console.log("reviewData: ", reviewData);
              })
              .catch(err => {
                console.log("error deleting reviewData", err);
              });

            Group.updateOne(
              { _id: LocationData.groupId },
              { $pull: { groupMarks: locationId } }
            )
              .then(groupData => {
                console.log("updated group? ", groupData);
              })
              .catch(err => {
                console.log("failed to update group", err);
              });

            LocationData.remove()
              .then(data => resolve(data))
              .catch(err => reject(err));
          })
          .catch(err => reject(err));
      });
    },

    // TODO: not tested!
    updateLocationById: (locationId, newData) => {
      return new Promise((resolve, reject) => {
        let {
          userId,
          locationName,
          locationAddress,
          priceRange,
          groupId
        } = newData;

        if (!(userId && groupId)) {
          reject("body requires userId and groupId");
          return;
        }
        if (
          !(
            mongoose.Types.ObjectId.isValid(locationId) &&
            mongoose.Types.ObjectId.isValid(userId)
          )
        ) {
          reject("provide valid userId in body, valid locationId in URL");
          return;
        }

        Location.findOne({ locationId })
          .then(doc => {
            if (!doc) {
              reject("Location doesn't exist"); //TURN INTO 404????????????
              return;
            }

            console.log("OLD DOC:", doc);
            console.log("NEW DOC:", newData);

            if (
              newData.locationId ||
              newData.locationReviews ||
              newData.geometry
            ) {
              reject("cannot update Location locationId, reviews, or geometry");
            } else {
              Group.findById(doc.groupId)
                .then(groupData => {
                  if (
                    groupData.groupMembers.some(id => {
                      return id.equals(userId);
                    })
                  ) {
                    if (priceRange && priceRange !== doc.priceRange) {
                      PriceRange.findOne({ priceRange })
                        .then(rangeData => {
                          rangeData.LocationList.push(locationId);
                          rangeData
                            .save()
                            .catch(err => console.log("err", err));
                        })
                        .catch(err => console.log("err", err));

                      PriceRange.findOne({ priceRange: doc.priceRange })
                        .then(rangeData => {
                          rangeData.LocationList.splice(
                            rangeData.LocationList.indexOf(locationId),
                            1
                          );
                          rangeData
                            .save()
                            .catch(err => console.log("err", err));
                        })
                        .catch(err => console.log("err", err));
                    }

                    doc.locationName = locationName
                      ? locationName
                      : doc.locationName;
                    doc.locationAddress = locationAddress
                      ? locationAddress
                      : doc.locationAddress;
                    doc.locationPriceRange = priceRange
                      ? priceRange
                      : doc.locationPriceRange;

                    doc
                      .save()
                      .then(data => {
                        resolve({ success: data });
                      })
                      .catch(err => reject(err));
                  } else {
                    reject("user does not belong to this Location's group");
                  }
                })
                .catch(err => reject(err));
            }
          })
          .catch(err => reject(err));
      });
    }
  };
};
