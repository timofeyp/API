const { botSettingsSchema } = require('$database/schemas/')
const { execNewSchedule, clientStatus } = require('$app/bot.js')
const passport = require('passport')
const { getToken } = require('$utils/getToken')
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
  await botSettingsSchema.updateOne({ }, update, { runValidators: true }, (err, settings) => {
    if (err) {
      res.status(400).send({ message: 'Failed', err })
    } else {
      res.send(settings)
    }
  })
  execNewSchedule(update)
})

router.get('/get-settings-secure', passport.authenticate('jwt', { session: false }), function (req, res) {
  const token = getToken(req.headers)
  if (token) {
    botSettingsSchema.findOne({}, (err, settings) => {
      if (err) {
        res.status(400).send({ message: 'Failed', err })
      } else {
        res.json(settings)
      }
    })
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' })
  }
})

router.get('/get-status-secure', passport.authenticate('jwt', { session: false }), function (req, res) {
  const token = getToken(req.headers)
  if (token) {
    res.send(clientStatus)
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' })
  }
})

module.exports = router
