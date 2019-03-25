const passport = require('passport')
const express = require('express')
const router = express.Router({})
const settings = require('$passport/settings')
const jwt = require('jsonwebtoken')
const User = require('$database/schemas/AdminUserList')

const getToken = function (headers) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    } else {
      return null
    }
  } else {
    return null
  }
}

router.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ success: false, msg: 'Please pass username and password.' })
  } else {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    const user = await newUser.save
    try {
      return res.json({ success: true, msg: 'Successful created new user.', user })
    } catch (err) {
      return res.json({ success: false, msg: 'Username already exists.' })
    }
  }
})

router.post('/login', function (req, res) {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err

    if (!user) {
      res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' })
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          let token = jwt.sign(user.toJSON(), settings.secret)
          // return the information including token as JSON
          res.json({ success: true, token: 'JWT ' + token })
        } else {
          res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' })
        }
      })
    }
  })
})

router.post('/login-by-jwt', passport.authenticate('jwt', { session: false }), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    res.json({ success: true, token: 'JWT ' + token })
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' })
  }
})

module.exports = router
