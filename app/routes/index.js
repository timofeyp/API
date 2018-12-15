const noteRoutes = require('./noteRoutes')
const mailRoutes = require('./mailRoutes')
const usersRoutes = require('./usersRoutes')
const settingsRoutes = require('./settingsRoutes')
const reportsRoutes = require('./reportsRoutes')

module.exports = function (app, db) {
  noteRoutes(app, db)
  mailRoutes(app, db)
  usersRoutes(app, db)
  settingsRoutes(app, db)
  reportsRoutes(app, db)
}
