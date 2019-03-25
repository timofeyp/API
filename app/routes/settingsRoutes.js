const { botSettingsSchema } = require('$database/schemas/')
const { execNewSchedule, clientStatus } = require('$app/bot.js')
const passport = require('passport')
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
const router = asyncRouter(express.Router({}))

router.post('/set-settings-secure', async (req, res) => {
  let update = {
    [req.body.pollHours || req.body.pollHours === 0 ? 'pollHours' : null]: parseInt(req.body.pollHours),
    [req.body.pollMinutes || req.body.pollMinutes === 0 ? 'pollMinutes' : null]: parseInt(req.body.pollMinutes),
    [req.body.pollDaysOfWeek ? 'pollDaysOfWeek' : null]: req.body.pollDaysOfWeek.toString(),
    [req.body.token ? 'token' : null]: req.body.token
  }
  const settings = await botSettingsSchema.updateOne({ }, update, { runValidators: true })
  execNewSchedule(update)
  return res.send(settings)
})

router.get('/get-settings-secure', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const settings = await botSettingsSchema.findOne({})
  return res.json(settings)
})

router.get('/get-status-secure', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.send(clientStatus)
})

module.exports = router
