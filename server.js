const express        = require('express');
const db             = require('./app/config/db');
const mongoose = require('./app/database')

const bodyParser     = require('body-parser');

const app            = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));  //ДОБАВЛЯЕТ В ЗАПРОС ОБЪЕКТ
// BODY

    require('./app/routes')(app);
    app.listen(port, () => {
        console.log('We are live on ' + port);
        module.exports = mongoose
    });


