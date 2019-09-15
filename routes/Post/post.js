const express = require("express");
const router = express.Router();
const dataService = require("./postService");
const data = dataService();

// get restaurants of specific price range
router.get('/post', (req, res, next) => {
    data.getPost().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

module.exports = router;