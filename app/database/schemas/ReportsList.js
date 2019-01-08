const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')


const { Schema } = mongoose

const Report = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscordUserList',
    required: true
  },
  reports: [{ reportNum: { type: Number }, text: { type: String }, date: { type: Date, default: Date.now } }],
  questionsDone: [{ questionNum: { type: Number }, done: { type: Boolean }, date: { type: Date, default: Date.now } }],
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false })
Report.plugin(mongoosePaginate)


const reportListSchema = mongoose.model('ReportList', Report)


module.exports = reportListSchema
