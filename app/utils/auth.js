const HttpStatus = require('http-status-codes')

module.exports = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    return res.json(HttpStatus.UNAUTHORIZED)
  }
}
