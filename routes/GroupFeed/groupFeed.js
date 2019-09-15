const express = require("express");
const router = express.Router();
const dataService = require("./groupFeedService");
const data = dataService();

// get restaurants of specific price range
router.get('/groupFeed', (req, res, next) => {
    data.getGroupFeed().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

module.exports = router;