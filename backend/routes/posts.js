const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Post = require('../models/post')
const checkAuth = require('../middleware/check-auth');


router.post('', checkAuth, (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    creator : req.userData.userId
  })

  post.save();
  res.status(201).json({
    message: "Post Created"
  })
})

router.get('', checkAuth, (req, res) => {

  Post.find().then((documents) => {
    let new_doc;
    if(documents.length>0){
      new_doc = documents.filter((doc)=>{
        return doc.creator == req.userData.userId;
      })
    }
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: new_doc
    });
  }).catch((err)=>{
    console.log("Error in fetching",err);
  });
})

router.get('/:id', (req, res) => {
  Post.findById(req.params.id).
    then((post) => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({
          message: 'Post not found!'
        })
      }
    })
})


router.put('/:id', checkAuth, (req, res) => {
  const post = {
    _id: req.params.id,
    title: req.body.title,
    body: req.body.body
  }

  Post.updateOne({ _id: req.params.id }, post)
    .then((result) => {
      if(result.n>0){
        res.status(200).json({ message: "Update successfull" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }

    })
})


router.delete('/:id',checkAuth, (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: "Post Deleted"
    })
  })
})

module.exports = router;
