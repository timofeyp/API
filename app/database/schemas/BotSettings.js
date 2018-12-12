const mongoose = require('mongoose')

const { Schema } = mongoose

const settings = new Schema({
  pollHours: {
    type: Number,
    required: true
  },
  pollMinutes: {
    type: Number,
    required: true
  },
  pollDaysOfWeek: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
})

const botSettingsSchema = mongoose.model('botSettings', settings)

module.exports = botSettingsSchema
