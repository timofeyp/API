const { getToken } = require('$utils/getToken')
const { questionsListSchema } = require('$database/schemas/')
const passport = require('passport')
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
const router = asyncRouter(express.Router({}))

router.post('/set-questions-secure', async (req, res) => {
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

router.get('/get-questions-secure', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const questions = await questionsListSchema.find({})
  try {
    res.json(questions)
  } catch (err) {
    res.status(400).send({ message: 'Failed', err })
  }
})

module.exports = router
