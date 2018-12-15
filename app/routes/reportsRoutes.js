const { reportListSchema } = require('../database/schemas/')

module.exports = (app) => {
  app.get('/get-reports', (req, res) => {
    reportListSchema.find(req.body, { _id: 0 }, (err, reports) => {
      if (err) {
        res.status(400).send({ message: 'failed', err })
      } else {
        res.send(reports)
      }
    })
  })
}