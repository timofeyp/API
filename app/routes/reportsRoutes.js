const { reportListSchema } = require('$database/schemas/')
const passport = require('passport')
require('$passport/passport')(passport)
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
const auth = require('$utils/auth')
const router = asyncRouter(express.Router({}))

const conditions = (conditions) => new Promise((resolve) => {
  resolve(conditions.authors ? {
    author: conditions.authors,
    reports: { $ne: null },
    created: {
      $gte: conditions.startDate,
      $lt: conditions.endDate
    }
  } : {
    reports: { $ne: null },
    created: {
      $gte: conditions.startDate,
      $lt: conditions.endDate
    }
  })
})

router.post('/get-reports-secure', auth, async (req, res) => {
  let conditionsObj = await conditions(req.body)
  const reports = await reportListSchema.paginate(
    conditionsObj,
    { page: req.body.page,
      limit: req.body.limit,
      populate: 'author',
      sort: { created: -1 }
    })
  return res.json(reports)
})

module.exports = router
