const express = require("express");
const router = express.Router();
const dataService = require("./reviewsService");
// const dataService = require("../../dataService");
const data = dataService();

//get reviews by restuarant
router.get('/reviews', (req, res, next) => {
    data.getReviewsByRestaurant(req.query).then(data => { //getAllReviews()
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send(err)
    })
})

// user adds review
router.post('/reviews', (req, res, next) => {
    console.log('add review for which restuarant id?', req.body)

    data.addReview(req.body).then(data => {
        console.log('answer: ', data)
        res.status(201).json(data)
    }).catch(err => {
        res.status(400).send({ 'error': err })
    })
});

// user edits review???
router.put('/reviews/:id', (req, res, next) => {
    console.log('update review with id:', req.params.id);
    console.log('new data: ', req.body)

    data.updateReviewById(req.params.id, req.body).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ 'error': err })
    })
});

// user deletes review
router.delete('/reviews/:id', (req, res, next) => {
    console.log('delete review with id: ', req.params.id);

    data.deleteReviewById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ 'error': err })
    })
});


module.exports = router;