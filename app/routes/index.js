const settingsRoutes = require('./settingsRoutes')
const reportsRoutes = require('./reportsRoutes')
const auth = require('./auth')
const discordUsersRoutes = require('./discordUsersRoutes')
const questionsRoutes = require('./questionsRoutes')

module.exports = app => {
  app.use('/api/users', require('./usersRoutes'))
  app.use('/api/settings', require('./settingsRoutes'))
  app.use('/api/reports', require('./reportsRoutes'))
  app.use('/api/auth', require('./auth'))
  app.use('/api/questions', require('./questionsRoutes'))
}
