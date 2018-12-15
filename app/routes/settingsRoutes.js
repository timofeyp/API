const { botSettingsSchema } = require('../database/schemas/')
const execNewSchedule = require('../bot.js')

module.exports = function (app) {
  app.get('/get-settings', (req, res) => {
    console.log(req.body)
    botSettingsSchema.findOne({}, { _id: 0 }, (err, settings) => {
      if (err) {
        res.status(400).send({ message: 'Create mail address failed', err })
      } else {
        res.send(settings)
      }
    })
  })
  app.post('/inject-settings', async (req, res) => {
    let update = {
      [req.body.pollHours ? 'pollHours' : null]: parseInt(req.body.pollHours),
      [req.body.pollMinutes ? 'pollMinutes' : null]: parseInt(req.body.pollMinutes),
      [req.body.pollDaysOfWeek ? 'pollDaysOfWeek' : null]: req.body.pollDaysOfWeek,
      [req.body.token ? 'token' : null]: req.body.token
    }
    await botSettingsSchema.updateOne({}, update, { runValidators: true }, (err, settings) => {
      if (err) {
        res.status(400).send({ message: 'Create mail address failed', err })
      } else {
        res.send(settings)
      }
    })
    execNewSchedule(update)
  })
}
