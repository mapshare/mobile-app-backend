const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create review Schema & model
const ReviewSchema = new Schema({
  locationId: {
    type: Schema.Types.ObjectId,
    required: [true, 'locationId is required for review'],
    // set: function(id) {
    //   this.previousResId = this.restaurantId;
    //   this._conditions = { ...this._conditions, restaurantId:id}
    //   console.log(id, "Previous restaurant id: ")
    //   return id
    // }

    // validate: {
    //   validator: function(v) {
    //     console.log("YYYYYYYYEEEEEEEEEOOOOOOOOOOOOOOOOOOOO", v)
    //     return null
    //     //return /\d{3}-\d{3}-\d{4}/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid phone number!`
    // },
  },
  reviewContent: {
    type: String,
    required: [true, 'content is required to save review']
  },
  reviewRating: {
    type: Number,
    required: [true, 'rating is required to save review']
  },
  reviewUser: {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'userId is required to save review']
    },
    userFirstName: String,
    userLastName: String
  },
  updatedAt: String,
  createdAt: String,
}, { runSettersOnQuery: true })

// const ReviewSchema = new Schema({
//   restaurantId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'restaurant',
//     required: [true, 'restaurantId is required to save review']
//   },
//   reviewList: [{
//     reviewId: mongoose.Schema.Types.ObjectId,
//     reviewContent: {
//       type: String,
//       required: [true, 'content is required to save review']
//     },
//     reviewRating: {
//       type: Number,
//       required: [true, 'rating is required to save review']
//     },
//     reviewUser: {
//       type: String,
//       required: [true, 'reviewUser is required to save review']
//     },
//   }]
// })

// ReviewSchema.pre('findOneAndUpdate', function(next) {
//   console.log('validating!!!!!!!!!!!!!!!!!!!!')
//   console.log('update: ', this.getUpdate())
//   console.log(this._previousResId)
//   //if (!this.isModified('password')) return next()
//   next()
// })


// ReviewSchema.post('findOneAndUpdate', function(doc) {
//   this._previousResId = this._update.reviewContent // resId, userid
//   console.log('DONE SAVING', this._previousResId)
// })

const Review = mongoose.model('review', ReviewSchema);

module.exports = Review;