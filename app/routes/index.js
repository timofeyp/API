const settingsRoutes = require('./settingsRoutes')
const reportsRoutes = require('./reportsRoutes')
const auth = require('./auth')
const discordUsersRoutes = require('./discordUsersRoutes')
const questionsRoutes = require('./questionsRoutes')

module.exports = function (app, db) {
  usersRoutes(app, db)
  settingsRoutes(app, db)
  reportsRoutes(app, db)
  auth(app, db)
  discordUsersRoutes(app, db),
  questionsRoutes(app, db)
}

module.exports = app => {
  app.use('/api/users', require('./usersRoutes'))
  app.use('/api/settings', require('./settingsRoutes'))
  app.use('/api/reports', require('./reportsRoutes'))
  app.use('/api/auth', require('./auth'))
  app.use('/api/questions', require('./questionsRoutes'))
};
