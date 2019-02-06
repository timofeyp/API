const { reportListSchema } = require('../database/schemas/')
const passport = require('passport')
require('../config/passport/passport')(passport)
const { getToken } = require('../utils/getToken')

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

module.exports = (app) => {
  app.get('/get-reports', async (req, res) => {
    let conditionsObj = await conditions(req.body)
    reportListSchema.paginate({
      ...conditionsObj
    }
    , { page: req.body.page, limit: 1, populate: 'author', sort: { created: -1 } })
      .then(reports => res.json(reports))
      .catch(err => res.status(400).send({ message: 'failed', err }))
  })

  app.post('/api/get-reports-secure', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const token = getToken(req.headers)
    let conditionsObj = await conditions(req.body)
    if (token) {
      reportListSchema.paginate({
        ...conditionsObj
      }
      , { page: req.body.page, limit: req.body.limit, populate: 'author', sort: { created: -1 } })
        .then(reports => {
          res.json(reports)
        })
        .catch(err => res.status(400).send({ message: 'failed', err }))
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' })
    }
  })
}
