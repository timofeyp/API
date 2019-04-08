const passport = require('passport')
const express = require('express')
const router = express.Router({})
const User = require('$database/schemas/AdminUserList')
const HttpStatus = require('http-status-codes')
const auth = require('$utils/auth')

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
  res.sendStatus(HttpStatus.OK)
})

router.post('/session-login', auth, (req, res) => {
  res.status(HttpStatus.OK).send({ user: req.user })
})

module.exports = router