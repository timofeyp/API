const { reportListSchema } = require('../database/schemas/')
var passport = require('passport')
require('../config/passport/passport')(passport)
const moment = require('moment')
const conditions = (conditions) => new Promise((resolve) => {
  let startDate = moment().year(conditions.date.start.year).month(conditions.date.start.month).day(conditions.date.start.day).hour(0).minute(0).utcOffset(0, true)
  let endDate = moment().year(conditions.date.end.year).month(conditions.date.end.month).day(conditions.date.end.day).hour(0).minute(0).utcOffset(0, true)
  resolve(conditions.authors ? {
    authors: conditions.authors,
    created: {
      $gte: startDate.toDate(),
      $lt: endDate.toDate()
    }
  } : {
    created: {
      $gte: startDate.toDate(),
      $lt: endDate.toDate()
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
    // const skip = { skip: parseInt(req.body.skip) }
    // const limit = { limit: parseInt(req.body.limit) }
    if (token) {
      // reportListSchema.find({}, null, { ...skip, ...limit }).populate('author').exec((err, reports) => {
      //   if (err) return next(err)
      //
      //   let reportsWithAuthor = reports.map(report => ({
      //     _id: report._id,
      //     author: report.author.name,
      //     created: report.created,
      //     reports: report.reports
      //   })
      //   )
      // res.json(reportsWithAuthor)
      reportListSchema.paginate({
        ...conditionsObj
      }
      , { page: req.body.page, limit: 1, populate: 'author', sort: { created: -1 } })
        .then(reports => res.json(reports))
        .catch(err => res.status(400).send({ message: 'failed', err }))
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' })
    }
  })
}
