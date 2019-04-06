const passport = require('passport')
const express = require('express')
const status = require('http-status')
const router = express.Router({})
const settings = require('$passport/settings')
const jwt = require('jsonwebtoken')
const User = require('$database/schemas/AdminUserList')
const getToken = require('$utils/getToken')
const HttpStatus = require('http-status-codes')


router.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ success: false, msg: 'Please pass username and password.' })
  } else {
    const newUser = {
      username: req.body.username,
      password: req.body.password
    }
    try {
      User.register(new User({ username: newUser.username }), newUser.password, err => res.json(err))
    } catch (err) {
      return res.json({ success: false, msg: 'Username already exists.', err })
    }
  }
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/')
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
