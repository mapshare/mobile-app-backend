const express = require("express");
const router = express.Router();
const dataService = require("./groupLocationService");
const data = dataService();

/*
Group Location ROUTES:
------------------------------------------------------------
GET     /groupLocation      = list all groupLocation
GET     /groupLocation/:id  = list groupLocation by id
POST    /groupLocation      = add groupLocation
PUT     /groupLocation/:id  = update groupLocation by id
DELETE  /groupLocation/:id  = Delete groupLocation by id
*/

// get list of groupLocation from db
router.get("/groupLocation", (req, res, next) => {
  data.getGroupLocation().then(data => {
    res.json(data);
  }).catch(err => {
    res.send({ 'Error: ': err })
  })
});

// add new groupLocation to db
router.post("/groupLocation", (req, res, next) => {
  data
    .addGroupLocation(req.body)
    .then(data => {
      console.log("answer: ", data);
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// get groupLocation from db
router.get("/groupLocation/:id", (req, res, next) => {
  // data service getgroupLocationById (groupLocationId)
  data
    .getGroupLocationById(req.params.id)
    .then(data => {
      console.log("got groupLocation data: ", data);
      res.status(200).json(data);
    })
    .catch(err => {
      console.log("error is: ", err);
      res.status(400).send({ "error:": err });
    });
});

// update groupLocation in db
router.put("/groupLocation/:id", (req, res, next) => {
  console.log("update info of groupLocation with id:", req.params.id);

  data
    .updateGroupLocationById(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data); // returns old data
    })
    .catch(err => {
      console.log("returning smt");
      res.status(400).send({ error: err });
    });
});

// delete groupLocation in db
router.delete("/groupLocation/:id", (req, res, next) => {
  console.log("delete groupLocation with id: ", req.params.id);

  data
    .deleteGroupLocationById(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

module.exports = router;
