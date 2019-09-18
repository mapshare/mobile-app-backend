const express = require("express");
const router = express.Router();
const dataService = require("./locationImagesService");
// const dataService = require("../../dataService");
const data = dataService();

//get locationimage by restuarant
router.get("/location-image", (req, res, next) => {
  data
    .getLocationImagesByLocation(req.query)
    .then(data => {
      //getAlllocationimage()
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// user deletes LocationImage
router.get("/location-image/:id", (req, res, next) => {
  console.log("delete LocationImage with id: ", req.params.id);

  data
    .getLocationImageById(req.params.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

// user adds LocationImage
router.post("/location-image", (req, res, next) => {
  console.log("add LocationImage for which location id?", req.body);

  data
    .addLocationImage(req.body)
    .then(data => {
      console.log("answer: ", data);
      res.status(201).json(data);
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

// user deletes LocationImage
router.delete("/location-image/:id", (req, res, next) => {
  console.log("delete LocationImage with id: ", req.params.id);

  data
    .deleteLocationImageById(req.params.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

module.exports = router;
