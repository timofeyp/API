require('sexy-require')
const express = require('express')
const app = express()
const mongoose = require('$app/database')
const bot = require('$app/bot')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const logger = require('$utils/log')(module)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('$database/schemas/AdminUserList')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')
app.use(session({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: ['secretkey1', 'secretkey2']
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))
require('$app/routes')(app)
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})
app.use((err, req, res, next) => {
  logger.error(err)
  res.status(err.status || 500)
  res.send(err.message)
})
app.listen(8090)
