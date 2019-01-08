const { DiscordUserListSchema } = require('../database/schemas/')
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
  app.get('/api/get-discord-users-secure', passport.authenticate('jwt', { session: false }), function (req, res) {
    const token = getToken(req.headers)
    if (token) {
      DiscordUserListSchema.find({}, ['name', 'subscribe'], (err, users) => {
        if (err) return next(err)
        res.json(users)
      })
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' })
    }
  })
}
