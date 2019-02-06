const { getToken } = require('../utils/getToken')
const { questionsListSchema } = require('../database/schemas/')
const passport = require('passport')

module.exports = function (app) {
  app.post('/api/set-questions-secure', async (req, res) => {
    let update = {
      num: req.body.num,
      text: req.body.text
    }
    await questionsListSchema.updateOne({ num: req.body.num }, update, { upsert: true }, (err, questions) => {
      if (err) {
        res.status(400).send({ message: 'Failed', err })
      } else {
        res.send(questions)
      }
    })
  })

  app.get('/api/get-questions-secure', passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers)
    if (token) {
      questionsListSchema.find({}, (err, questions) => {
        if (err) {
          res.status(400).send({ message: 'Failed', err })
        } else {
          res.json(questions)
        }
      })
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' })
    }
  })
}
