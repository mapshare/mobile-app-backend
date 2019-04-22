const express = require("express");
const router = express.Router();

const dataService = require("../dataService");
const data = dataService();

// prevent 304
router.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});

// get list of restaurants from db
router.get('/restaurants', (req,res,next) => {
  data.getRestaurants().then(data => {
    res.json(data);
  }).catch(err => {
    res.send({'ilya error?': err})
  })
});

// add new restaurant to db
router.post('/restaurants', (req,res,next) => {
  data.addRestaurant(req.body).then(data => {
    console.log('answer: ', data)
    res.status(201).json(data)
  }).catch(err => {
    res.status(400).send(err)
  })
});

/////////////////////////RESTAURANTS///////////////////////////////

// get restaurant from db
router.get('/restaurants/:id', (req,res,next) => {

  // data service getRestaurantById (locationId)
  data.getRestaurantById(req.params.id).then(data => {
    console.log('got restaurant data: ', data)
    res.status(200).json(data)
  }).catch(err => {
    console.log('error is: ', err)
    res.status(400).send({'error:': err})
  })
});

// update restaurant in db
router.put('/restaurants/:id', (req,res,next) => {
  console.log('update info of restaurant with id:', req.params.id);

  data.updateRestaurantById(req.params.id, req.body).then(data => {
    res.status(200).json(data) // returns old data
  }).catch(err => {
    console.log('returning smt')
    res.status(400).send({'error': err})
  })

});

// delete restaurant in db
router.delete('/restaurants/:id', (req,res,next) => {
  console.log('delete restaurant with id: ', req.params.id);

  data.deleteRestaurantById(req.params.id, req.body).then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(400).send({'error': err})
  })
});

/////////////////////////REVIEWS///////////////////////////////

//get reviews by restuarant
router.get('/reviews', (req,res,next) => {
  data.getReviewsByRestaurant(req.query).then(data => { //getAllReviews()
    res.status(200).json(data)
  }).catch(err => {
    res.status(400).send(err)
  })
})

// user adds review
router.post('/reviews', (req,res,next) => {
  console.log('add review for which restuarant id?', req.body)

  data.addReview(req.body).then(data => {
    console.log('answer: ', data)
    res.status(201).json(data)
  }).catch(err => {
    res.status(400).send({'error': err})
  })
});

// user edits review???
router.put('/reviews/:id', (req,res,next) => {
  console.log('update review with id:', req.params.id);
  console.log('new data: ', req.body)

  data.updateReviewById(req.params.id, req.body).then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(400).send({'error': err})
  })
});

// user deletes review
router.delete('/reviews/:id', (req,res,next) => {
  console.log('delete review with id: ', req.params.id);

  data.deleteReviewById(req.params.id).then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(400).send({'error': err})
  })
});

/////////////////////////MARKS///////////////////////////////

// get all marks to populate map
router.get('/marks', (req,res,next) => {
  if (req.query.priceRange) {
    data.getMarksByPriceRange(req.query).then(data => {
      res.json(data);
    }).catch(err => {
      res.send(err)
    })
  } else {
    data.getMarks(req.query).then(data => {
      res.json(data);
    }).catch(err => {
      res.send(err)
    })
  }
});

/////////////////////////USER///////////////////////////////

// // get all users // remove in production!
// router.get('/users', (req,res,next) => {
//   data.getUsers().then(data => {
//     res.json(data);
//   }).catch(err => {
//     res.send({'ilya error?': err})
//   })
// });

// add new user
router.post('/users', (req,res,next) => {
  //data.addUser(req.body).then(data => {
  data.processUser(req.body).then(data => {
    res.status(200).json(data);
  }).catch(err => {
    res.status(400).send(err)
  })
});

// get user by id
router.get('/users/:id', (req,res,next) => {
  data.getUserById(req.params.id).then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(400).send({"error": err})
  })
})

// add user to existing group (or other update?)
router.put('/users/:id', (req,res,next) => {
  data.updateUserById(req.params.id, req.body).then(data => {
    res.status(200).json(data);
  }).catch(err => {
    res.status(400).send({"error":err})
  })
});

/////////////////////////CUISINE///////////////////////////////

// provide options for cuisines?
router.get('/cuisines', (req,res,next) => {
  res.send({type: 'GET all cuisines'});
});

// get restaurants of specific cuisine
router.get('/cuisines/:cuisine', (req,res,next) => {
  res.send({type: 'GET restaurants of specific cuisine'});
});

/////////////////////////PRICE RANGE///////////////////////////////

// get restaurants of specific price range
router.get('/priceRanges/:priceRange', (req,res,next) => {
  res.send({type: 'GET restaurants of specific price range'});
});

/////////////////////////GROUPS////////////////////////////////////

//list groups
router.get('/groups', (req,res,next) => {
  data.getGroups().then(data => {
    res.json(data);
  }).catch(err => {
    res.send({'ilya error?': err})
  })
});

//add group
router.post('/groups', (req,res,next) => {
  data.addGroup(req.body).then(data => {
    res.status(200).json(data);
  }).catch(err => {
    res.status(400).send({"error": err})
  })
});

//list members of group
router.get('/groups/:groupId', (req,res,next) => {
  data.getGroup(req.params.groupId).then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(400).send({"error": err})
  })
});

///////////////////////////////////////////////////////////////////

module.exports = router;