
const mailRoutes = require('./mailRoutes')
const usersRoutes = require('./usersRoutes')
const settingsRoutes = require('./settingsRoutes')
const reportsRoutes = require('./reportsRoutes')
const auth = require('./auth')
const discordUsersRoutes = require('./discordUsersRoutes')
const questionsRoutes = require('./questionsRoutes')

module.exports = function (app, db) {
  mailRoutes(app, db)
  usersRoutes(app, db)
  settingsRoutes(app, db)
  reportsRoutes(app, db)
  auth(app, db)
  discordUsersRoutes(app, db),
  questionsRoutes(app, db)
}
