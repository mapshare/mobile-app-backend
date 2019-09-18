const express = require("express");
const router = express.Router();
const dataService = require("./locationsService");
// const dataService = require("../../dataService");
const data = dataService();

// get list of locations from db
router.get("/locations", (req, res, next) => {
  data
    .getLocations()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send({ "ilya error?": err });
    });
});

// add new location to db
router.post("/locations", (req, res, next) => {
  data
    .addLocation(req.body)
    .then(data => {
      console.log("answer: ", data);
      res.status(201).json(data);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// get location from db
router.get("/locations/:id", (req, res, next) => {
  // data service getlocationById (locationId)
  data
    .getLocationById(req.params.id)
    .then(data => {
      console.log("got location data: ", data);
      res.status(200).json(data);
    })
    .catch(err => {
      console.log("error is: ", err);
      res.status(400).send({ "error:": err });
    });
});

// update location in db
router.put("/locations/:id", (req, res, next) => {
  console.log("update info of location with id:", req.params.id);

  data
    .updateLocationById(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data); // returns old data
    })
    .catch(err => {
      console.log("returning smt");
      res.status(400).send({ error: err });
    });
});

// delete location in db
router.delete("/locations/:id", (req, res, next) => {
  console.log("delete location with id: ", req.params.id);

  data
    .deleteLocationById(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

module.exports = router;
