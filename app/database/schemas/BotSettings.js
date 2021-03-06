const mongoose = require('mongoose')

const { Schema } = mongoose

const Settings = new Schema({
  pollHours: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => {
        return /^([0-9]|1[0-9]|2[0-3])$/.test(v)
      },
      message: props => `${props.value} is not a valid!`
    }
  },
  pollMinutes: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => {
        return /^([0-9]|[1-5][0-9])$/.test(v)
      },
      message: props => `${props.value} is not a valid!`
    }
  },
  pollDaysOfWeek: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /^([0-7]|([0-7],){1,6}[0-7]|\s)$/.test(v)
      },
      message: props => `${props.value} is not a valid!`
    }
  },
  token: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 60
  }
})

const botSettingsSchema = mongoose.model('Settings', Settings)

module.exports = botSettingsSchema
