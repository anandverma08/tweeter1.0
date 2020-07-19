const express = require('express');
const User = require('../models/user');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

router.post('/signUp', (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user.save()
      .then((result) => {
        res.status(201).json({
          message: "User Created",
          result: result
        })
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        })
      })

  })
})

router.post('/login', (req, res) => {
  let fetchedUser;
  console.log("inside login")
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'Invalid Credentials!'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: 'Invalid Credentials!'
        })
      }
      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, process.env.JWT_KEY,
        {
          expiresIn: "1h"
        });
        console.log("token",token);
      res.status(200).json({
        token: token,
        expiresIn: 3600
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'User not found!'
      });
    });

})

module.exports = router;
