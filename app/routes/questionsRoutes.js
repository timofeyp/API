const { getToken } = require('$utils/getToken')
const { questionsListSchema } = require('$database/schemas/')
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
const auth = require('$utils/auth')
const router = asyncRouter(express.Router({}))

router.post('/set-questions-secure', auth, async (req, res) => {
  let update = {
    num: req.body.num,
    text: req.body.text
  }
  const questions = await questionsListSchema.updateOne({ num: req.body.num }, update, { upsert: true })
  return res.json(questions)
})

router.get('/get-questions-secure', auth, async (req, res) => {
  const questions = await questionsListSchema.find({})
  return res.json(questions)
})

module.exports = router
