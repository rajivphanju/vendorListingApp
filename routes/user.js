const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/user");
const bcrypt = require('bcrypt');

//register user

router.post('/register', (req, res) => {

  User.find({
      username: req.body.username
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(201).json({
          message: "Username already exists. Please use different username"
        });
      } else {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          contactAddress: req.body.contactAddress,
          emailAddress: req.body.emailAddress,
          username: req.body.username,
          password: req.body.password,
        });
        user
          .save()
          .then(result => {
            res.status(201).json({
              message: "Register Successfull"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              message: err
            });
          });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    });
})

//login
router.post('/login', async (req, res) => {

  try {
    const username = req.body.username;

    const password = req.body.password;
    const user = await User.findByCredentials(username, password)
    if (!user) {
      return res.status(401).send({
        error: 'Login failed! Check authentication credentials'
      })
    }
    const token = await user.generateAuthToken()
    res.status(201).json({
      user,
      token
    })
  } catch (err) {
    res.status(401).json(err.message)
  }

})


// View logged in user profile
router.get('/profile', auth, async (req, res) => {
  res.send(req.user)
})
//change password

router.put('/changePassword', auth, async (req, res,next) => {
  var username = req.user.username;
  if (req.body.oldPassword !== req.body.newPassword) {
    try {
      const user = await User.findByCredentials(username, req.body.oldPassword)
      if(user){
        hashedPassword = await bcrypt.hash(req.body.newPassword, 8);

      if (hashedPassword) {
        User.findByIdAndUpdate(user._id, {
          $set: {
            password: hashedPassword
          }
        }, {
          new: true
        }).then(function (result) {
          if (result) {
            res.json({
              message: "Password Changed"
            });
          }

        }).catch(function (e) {
          res.send(e);
        });
      }
      }

    } catch (err) {
     
      res.status(401).json(err.message)

    }
  } else {
    res.status(400).send({
      message: "Please use different password"
    })
  }


});



module.exports = router;