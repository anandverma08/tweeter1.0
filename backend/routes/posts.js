const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Post = require('../models/post')


router.post('', (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body
  })

  console.log(post);
  post.save();
  res.status(201).json({
    message: "Post Created"
  })
})

router.get('', (req, res) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents
    });
  }).catch(()=>{
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


router.put('/:id', (req, res) => {
  const post = {
    _id: req.params.id,
    title: req.body.title,
    body: req.body.body
  }
  Post.updateOne({ _id: req.params.id }, post)
    .then((result) => {
      res.status(200).json({ message: "Update successfull" });
    })
})


router.delete('/:id', (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: "Post Deleted"
    })
  })
})

module.exports = router;
