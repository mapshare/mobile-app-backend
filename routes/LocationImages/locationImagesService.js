const mongoose = require("mongoose");
const Location = require("../../models/location");
const LocationImage = require("../../models/locationImage");

module.exports = () => {
  return {
    //get LocationImages for specific location
    getLocationImagesByLocation: reqQuery => {
      return new Promise((resolve, reject) => {
        let { locationId } = reqQuery;

        if (!locationId) {
          reject({ error: "include locationId in query" });
          return;
        }

        Location.aggregate([
          {
            $match: { locationId: mongoose.Types.ObjectId(locationId) }
          },
          {
            $lookup: {
              from: "LocationImages",
              localField: "locationImageSet",
              foreignField: "_id",
              as: "locationImageSet"
            }
          },
          {
            $project: {
              groupId: 0,
              _id: 0,
              __v: 0,
              "locationImageSet.locationId": 0,
              "locationImageSet.__v": 0
            }
          }
        ])
          .then(data => {
            if (data.length === 1) {
              resolve(data[0]);
            } else {
              reject({ error: "locationId doesn't exist" });
            }
          })
          .catch(err => reject(err));

        // Location.findOne({ locationId })
        // .populate("LocationLocationImages")
        // .then(data => {
        //   if (data) {
        //     console.log('LocationLocationImages', data.LocationLocationImages)
        //     resolve(data)
        //   } else {
        //     reject({"error": "no Location with specified id"})
        //   }
        // })
        // .catch(err => reject(err));
      });
    },

    getLocationImageById: imageId => {
      return new Promise((resolve, reject) => {
        Restaurant.findOne({ imageId })
          .then(data => {
            if (data) resolve(data);
            else reject("no image with specified id");
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // TODO: do we need user name for the images?
    addLocationImage: LocationImageData => {
      return new Promise((resolve, reject) => {
        let { locationId } = LocationImageData;

        if (!locationId) {
          reject(
            "include locationId, LocationImageUser, and LocationImageUser.userId"
          );
          return;
        }

        Location.findOne({ locationId })
          .populate("groupId")
          .then(doc => {
            if (!doc) {
              reject("Location doesn't exist");
              return;
            }
            // FYI
            // else if (
            //   !doc.groupId.groupMembers.some(id => {
            //     return id.equals(LocationImageData.LocationImageUser.userId);
            //   })
            // ) {
            //   reject("user doesn't belong to group");
            //   return;
            // }

            // LocationImage only created if user in group
            LocationImage.create({
              ...LocationImageData
            })
              .then(LocationImageData => {
                console.log(
                  "returned from LocationImage creation",
                  LocationImageData
                );
                doc.LocationLocationImages.push(LocationImageData.id);

                doc
                  .save()
                  .then(d => {
                    console.log(
                      "returned from adding LocationImage to Location",
                      d
                    );
                    resolve(LocationImageData);
                  })
                  .catch(err => {
                    console.log("couldnt add LocationImage to restuarant");
                    reject(err);
                  });
              })
              .catch(err => reject(err));
          })
          .catch(err => reject(err));
      });
    },

    deleteLocationImageById: id => {
      return new Promise((resolve, reject) => {
        // USER PERMISSIONS???
        LocationImage.findByIdAndDelete(id)
          .then(data => {
            if (data) {
              console.log("LocationImage delete results:", data);
              resolve({ success: "LocationImage deleted" });
            } else reject("no LocationImage with specified id");
          })
          .catch(err => {
            console.log("fail");
            reject(err.message);
          });
      });
    }
  };
};
