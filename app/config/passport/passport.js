const JwtStrategy = require('passport-jwt').Strategy

const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../../database/schemas/AdminUserList')
const settings = require('./settings')

module.exports = (passport) => {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  opts.secretOrKey = settings.secret
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    console.log(jwtPayload)
    User.findOne({ id: jwtPayload.id }, (err, user) => {
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
