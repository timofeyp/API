const { reportListSchema } = require('$database/schemas/')
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
const router = asyncRouter(express.Router({}))

router.post('/add', (req, res) => {
  const newAddress = reportListSchema(req.body)
  newAddress.save((err, address) => {
    if (err) {
      res.status(400).send({ message: 'Create mail address failed', err })
    } else {
      res.send({ message: 'Mail address created successfully', newAddressList: address })
    }
  })
})

module.exports = router
