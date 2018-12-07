const mongoose = require('mongoose');

const { Schema } = mongoose;

const report = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discordUserList',
        required: true
    },
    reports: [{ body: {type: String}, date: { type: Date, default: Date.now } }],
    questionsDone: [{ questionNum: {type: Number, unique: true}, done: {type: Boolean} ,date: { type: Date, default: Date.now } }],
    created: {
        type: Date,
        default: Date.now
    }
});

const reportListSchema= mongoose.model('reportList', report);

module.exports = reportListSchema;
