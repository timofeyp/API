const { discordUserListSchema } = require('$database/schemas/')
const passport = require('passport')
require('$passport/passport')(passport)
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
const auth = require('$utils/auth')
const router = asyncRouter(express.Router({}))

router.get('/get-discord-users-secure', auth, async (req, res) => {
  const list = await discordUserListSchema.find({}, ['name', 'subscribe'])
  return res.json(list)
})

module.exports = router
