const dbUrl = require('$config/db')
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.set('debug', true)

const options = { useNewUrlParser: true }

const database = mongoose.connect(dbUrl.url, options)
  .then(() => console.log('Connected to database.'))
  .catch(err => console.error('Error connecting to database:', err.message))

module.exports = database
