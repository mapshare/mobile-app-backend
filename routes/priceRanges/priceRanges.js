const express = require("express");
const router = express.Router();
const dataService = require("./priceRangesService");
//const dataService = require("../../dataService");
const data = dataService();


// get restaurants of specific price range
router.get('/priceRanges/:priceRange', (req, res, next) => {
    res.send({ type: 'GET restaurants of specific price range' });
});

module.exports = router;