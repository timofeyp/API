const mongoose = require('mongoose');

const { Schema } = mongoose;

const report = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discordUserList'
    },
    report: { type: String, required: true },
    date: { type: String, required: true, unique: true },
    created: {
        type: Date,
        default: Date.now
    }
});

const reportList= mongoose.model('reportList', report);

module.exports = reportList;
