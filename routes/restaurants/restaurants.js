const express = require("express");
const router = express.Router();
const dataService = require("./restaurantsService");
// const dataService = require("../../dataService");
const data = dataService();

// get list of restaurants from db
router.get('/restaurants', (req, res, next) => {
    data.getRestaurants().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'ilya error?': err })
    })
});

// add new restaurant to db
router.post('/restaurants', (req, res, next) => {
    data.addRestaurant(req.body).then(data => {
        console.log('answer: ', data)
        res.status(201).json(data)
    }).catch(err => {
        res.status(400).send(err)
    })
});


// get restaurant from db
router.get('/restaurants/:id', (req, res, next) => {

    // data service getRestaurantById (locationId)
    data.getRestaurantById(req.params.id).then(data => {
        console.log('got restaurant data: ', data)
        res.status(200).json(data)
    }).catch(err => {
        console.log('error is: ', err)
        res.status(400).send({ 'error:': err })
    })
});

// update restaurant in db
router.put('/restaurants/:id', (req, res, next) => {
    console.log('update info of restaurant with id:', req.params.id);

    data.updateRestaurantById(req.params.id, req.body).then(data => {
        res.status(200).json(data) // returns old data
    }).catch(err => {
        console.log('returning smt')
        res.status(400).send({ 'error': err })
    })

});

// delete restaurant in db
router.delete('/restaurants/:id', (req, res, next) => {
    console.log('delete restaurant with id: ', req.params.id);

    data.deleteRestaurantById(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ 'error': err })
    })
});

module.exports = router;