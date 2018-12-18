const mongoose = require('mongoose')

const { Schema } = mongoose

const Report = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'discordUserList',
    required: true
  },
  reports: [{ reportNum: { type: Number }, text: { type: String }, date: { type: Date, default: Date.now } }],
  questionsDone: [{ questionNum: { type: Number }, done: { type: Boolean }, date: { type: Date, default: Date.now } }],
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false })

const reportListSchema = mongoose.model('ReportList', Report)

module.exports = reportListSchema
