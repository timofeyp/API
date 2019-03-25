const { DiscordUserListSchema } = require('$database/schemas/')
const passport = require('passport')
require('$passport/passport')(passport)
const { getToken } = require('$utils/getToken')
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
const router = asyncRouter(express.Router({}))

router.get('/get-discord-users-secure', passport.authenticate('jwt', { session: false }), function (req, res) {
  const token = getToken(req.headers)
  if (token) {
    DiscordUserListSchema.find({}, ['name', 'subscribe'], (err, users) => {
      if (err) return next(err)
      res.json(users)
    })
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' })
  }
})

module.exports = router
