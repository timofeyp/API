const express = require('express')
const app = express()
const mongoose = require('./app/database')
const bot = require('./app/bot')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const port = 8090
app.use(bodyParser.urlencoded({ extended: true })) // ДОБАВЛЯЕТ В HTTP ЗАПРОС ОБЪЕКТ
// BODY
app.use(bodyParser.json())

require('./app/routes')(app)
app.listen(port, () => {
  console.log('We are live on ' + port)
  module.exports = mongoose
})

app.use(morgan('dev'))
