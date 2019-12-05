const express = require("express");
const router = express.Router();
const dataService = require("./userService");
const data = dataService();
const { verifyLoginToken } = require("../auth/verifyToken");

/*
Users ROUTES:
------------------------------------------------------------
GET     /user  = get user
PUT     /user  = update user using JWT
DELETE  /user  = delete user using JWT
*/

/*
// get all users // remove in production!
router.get("/users", (req, res, next) => {
  data
    .getUsers()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send({ "ilya error?": err });
    });
});

// add new user
router.post("/users", (req, res, next) => {
  data
    .addUser(req.body)
    .then(data => {
      //data.processUser(req.body).then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});
*/

// get user using JWT
router.get("/user", verifyLoginToken, async (req, res, next) => {
  try {
    const results = await data.getUsers(req.user);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).send({ "error": error });
  }
});

// update user using JWT
router.put("/user", verifyLoginToken, async (req, res, next) => {
  try {
    const results = await data.updateUserById(req.user, req.body);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).send({ "error": error });
  }
});

// delete users using JWT
router.delete("/user", verifyLoginToken, (req, res, next) => {
  data.deleteUserbyId(req.user)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

// comparePassword
router.put("/comparePassword", verifyLoginToken, async (req, res, next) => {
  try {
    const results = await data.comparePassword(req.user, req.body);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).send({ "error": error });
  }
});


module.exports = router;
