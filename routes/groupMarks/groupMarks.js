const express = require("express");
const router = express.Router();
const dataService = require("./groupMarkService");
const data = dataService();

/*
Group Mark ROUTES:
------------------------------------------------------------
GET     /groupMark      = list all groupMark
GET     /groupMark/:id  = list groupMark by id
POST    /groupMark      = add groupMark
PUT     /groupMark/:id  = update groupMark by id
DELETE  /groupMark/:id  = Delete groupMark by id
*/

// get list of groupMark from db
router.get("/groupMark", (req, res, next) => {
  data.getGroupMark().then(data => {
    res.json(data);
  }).catch(err => {
    res.send({ 'Error: ': err })
  })
});

// add new groupMark to db
router.post("/groupMark", (req, res, next) => {
  data.addGroupMark(req.body)
    .then(data => {
      console.log("answer: ", data);
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// get groupMark from db
router.get("/groupMark/:id", (req, res, next) => {
  data.getGroupMarkById(req.params.id)
    .then(data => {
      console.log("got groupMark data: ", data);
      res.status(200).json(data);
    })
    .catch(err => {
      console.log("error is: ", err);
      res.status(400).send({ "error:": err });
    });
});

// update groupMark in db
router.put("/groupMark/:id", (req, res, next) => {
  data.updateGroupMarkById(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data); // returns old data
    })
    .catch(err => {
      console.log("returning smt");
      res.status(400).send({ error: err });
    });
});

// delete groupMark in db
router.delete("/groupMark/:id", (req, res, next) => {
  data.deleteGroupMarkById(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

module.exports = router;
