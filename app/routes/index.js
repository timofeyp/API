const noteRoutes = require('./note_routes');
const mailRoutes = require('./mail_routes');
const usersRoutes = require('./users_routes');
module.exports = function(app, db) {
    noteRoutes(app, db);
    mailRoutes(app, db);
    usersRoutes(app, db)
};
