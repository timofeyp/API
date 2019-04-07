const HttpStatus = require('http-status-codes')

module.exports = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    return res.sendStatus(HttpStatus.UNAUTHORIZED)
  }
}
