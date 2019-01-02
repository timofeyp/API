const { reportListSchema } = require('../database/schemas/')
var passport = require('passport')
require('../config/passport/passport')(passport)

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
  app.get('/get-reports', (req, res) => {
    reportListSchema.find({}, ['author'], { limit: 2 }, (err, reports) => {
      if (err) {
        res.status(400).send({ message: 'failed', err })
      } else {
        res.send(reports)
      }
    })
  })

  app.get('/api/get-reports-secure', passport.authenticate('jwt', { session: false }), function (req, res) {
    const token = getToken(req.headers)
    if (token) {
      reportListSchema.find({}, ['author', 'reports', 'created'], (err, reports) => {
        if (err) return next(err)
        res.json(reports)
      })
      reportListSchema.find({}).populate('author').exec((err, reports) => {
        if (err) return next(err)

        let reportsWithAuthor = reports.map(report => ({
          author: report.author.name,
          created: report.created,
          reports: report.reports
        })
        )
      //  console.log(reportsWithAuthor)
      })
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' })
    }
  })
}
