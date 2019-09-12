const express = require("express");
const router = express.Router();
const dataService = require("./marksService");
//const dataService = require("../../dataService");
const data = dataService();

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


  module.exports = router;