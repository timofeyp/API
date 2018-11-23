const noteRoutes = require('./note_routes');
const mailRoutes = require('./mail_routes');
module.exports = function(app, db) {
    noteRoutes(app, db);
    mailRoutes(app, db);
    // Тут, позже, будут и другие обработчики маршрутов
};
