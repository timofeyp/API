const { DiscordUserListSchema } = require('$database/schemas/')
const passport = require('passport')
require('$passport/passport')(passport)
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
const router = asyncRouter(express.Router({}))

router.get('/get-discord-users-secure', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const list = await DiscordUserListSchema.find({}, ['name', 'subscribe'])
  return res.json(list)
})

module.exports = router
