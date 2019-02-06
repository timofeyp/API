const { reportListSchema } = require('../database/schemas/')
const passport = require('passport')
require('../config/passport/passport')(passport)
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

const getToken = function (headers) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    } else {
      return null
    }
  } else {
    return null
  }
}

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
    console.log(req.body)
    let conditionsObj = await conditions(req.body)
    if (token) {
      reportListSchema.paginate({
        ...conditionsObj
      }
      , { page: req.body.page, limit: req.body.limit, populate: 'author', sort: { created: -1 } })
        .then(reports => {
            res.json(reports)
            console.log(reports)
        })
        .catch(err => res.status(400).send({ message: 'failed', err }))
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' })
    }
  })
}
