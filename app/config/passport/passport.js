var JwtStrategy = require('passport-jwt').Strategy

var ExtractJwt = require('passport-jwt').ExtractJwt

// load up the user model
var User = require('../../database/schemas/AdminUserList')
var settings = require('./settings') // get settings file

module.exports = function (passport) {
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  opts.secretOrKey = settings.secret
  passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
    console.log(jwtPayload)
    User.findOne({ id: jwtPayload.id }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))
}
