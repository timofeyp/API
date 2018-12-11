const mongoose = require('mongoose');

const { Schema } = mongoose;

const report = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discordUserList',
        required: true
    },
    reports: [{ reportNum: {type: Number},text: {type: String}, date: { type: Date, default: Date.now } }],
    questionsDone: [{ questionNum: {type: Number}, done: {type: Boolean} ,date: { type: Date, default: Date.now } }],
    created: {
        type: Date,
        default: Date.now
    }
}, { strict: false });

//report.index({ created: 1, questionNum: 1}, { unique: true })

const reportListSchema= mongoose.model('reportList', report);

module.exports = reportListSchema;
