const express = require("express");
const router = express.Router();
const dataService = require("./postService");
const data = dataService();

// get list of all posts
router.get('/post', (req, res, next) => {
    data.getPost().then(data => {
        res.json(data);
    }).catch(err => {
        res.send({ 'Error: ': err })
    })
});

// add post
router.post('/post', (req, res, next) => {
    data.addPost(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.log("HERE HERE HERE HERE" + err);
        res.status(400).send({ "error": err })
    })
});

// get post by id
router.get('/post/:postid', (req, res, next) => {
    data.getPostById(req.params.postid).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })
});

// update post in db
router.put('/post/:id', (req, res, next) => {
    data.updatePostById(req.params.id, req.body).then(data => {
        res.status(200).json(data) 
    }).catch(err => {
        console.log(err);
        res.status(400).send({ "error": err })
    })

});

// delete post in db
router.delete('/post/:id', (req, res, next) => {
    data.deletePostById(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(400).send({ "error": err })
    })
});

module.exports = router;