const passport = require('passport')
const express = require('express')
const router = express.Router({})
const settings = require('$passport/settings')
const jwt = require('jsonwebtoken')
const User = require('$database/schemas/AdminUserList')
const getToken = require('$utils/getToken')

router.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ success: false, msg: 'Please pass username and password.' })
  } else {
    const newUser = {
      username: req.body.username,
      password: req.body.password
    }
    try {
      const user = await User.create(newUser)
      return res.json({ success: true, msg: 'Successful created new user.', user })
    } catch (err) {
      return res.json({ success: false, msg: 'Username already exists.', err })
    }
  }
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' })
  } else {
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (isMatch && !err) {
        let token = jwt.sign(user.toJSON(), settings.secret)
        res.json({ success: true, token: 'JWT ' + token })
      } else {
        res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' })
      }
    })
  }
})

router.post('/login-by-jwt', passport.authenticate('jwt', { session: false }), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    res.json({ success: true, token: 'JWT ' + token })
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized' })
  }
})

module.exports = router
