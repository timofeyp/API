const mongoose = require('mongoose');

const { Schema } = mongoose;

const report = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discordUserList'
    },
    reportOne: { body: String, date: { type: Date, default: Date.now } },
    reportTwo: { body: String, date: { type: Date, default: Date.now } },
    reportThree: { body: String, date: { type: Date, default: Date.now } },
    questionOne: { type: Boolean, default: false},
    questionTwo: { type: Boolean, default: false},
    questionThree: { type: Boolean, default: false},
    created: {
        type: Date,
        default: Date.now
    }
});

const reportListSchema= mongoose.model('reportList', report);

module.exports = reportListSchema;
