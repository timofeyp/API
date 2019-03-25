module.exports = app => {
  app.use('/api/settings', require('./settingsRoutes'))
  app.use('/api/reports', require('./reportsRoutes'))
  app.use('/api/auth', require('./auth'))
  app.use('/api/questions', require('./questionsRoutes'))
}
