const noteRoutes = require('./noteRoutes')
const mailRoutes = require('./mailRoutes')
const usersRoutes = require('./usersRoutes')
module.exports = function (app, db) {
  noteRoutes(app, db)
  mailRoutes(app, db)
  usersRoutes(app, db)
}
