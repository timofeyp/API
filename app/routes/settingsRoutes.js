const { botSettingsSchema } = require('../database/schemas/')

module.exports = function (app) {
  app.get('/get-settings', (req, res) => {
    botSettingsSchema.findOne({}, { _id: 0 }, (err, settings) => {
      if (err) {
        res.status(400).send({ message: 'Create mail address failed', err })
      } else {
        res.send(settings)
      }
    })
  })
    app.post('/inject-settings', (req, res) => {
        botSettingsSchema.updateOde({}, { _id: 0 }, (err, settings) => {
            if (err) {
                res.status(400).send({ message: 'Create mail address failed', err })
            } else {
                res.send(settings)
            }
        })
    })
}
