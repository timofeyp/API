const { addressList } = require('$database/schemas/')
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
const router = asyncRouter(express.Router({}))

router.post('/add-mail', (req, res) => {
  const newAddress = addressList(req.body)
  newAddress.save((err, address) => {
    if (err) {
      res.status(400).send({ message: 'Create mail address failed', err })
    } else {
      res.send({ message: 'Mail address created successfully', newAddressList: address })
    }
  })
})

router.post('/rm-mail', (req, res) => {
  addressList.findByIdAndRemove(req.body.id, (err, address) => {
    if (err) {
      res.status(400).send({ message: 'Delete mail address failed', err })
    } else {
      res.send({ message: 'Mail address deleted successfully', newAddressList: address })
    }
  })
})

module.exports = router
