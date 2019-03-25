const { reportListSchema } = require('$database/schemas/')
const passport = require('passport')
require('$passport/passport')(passport)
const express = require('express')
const asyncRouter = require('$utils/asyncRouter')
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

router.post('/get-reports-secure', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let conditionsObj = await conditions(req.body)
  const reports = await reportListSchema.paginate(
    conditionsObj,
    { page: req.body.page,
      limit: req.body.limit,
      populate: 'author',
      sort: { created: -1 }
    })
  res.json(reports)
})

module.exports = router
