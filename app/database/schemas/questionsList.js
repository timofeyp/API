const mongoose = require('mongoose');

const { Schema } = mongoose;

const questions = new Schema({
    num: {
        type: Number,
        required: true
    },
    text: {
        type: Number,
        required: true
    }
});

const questionsList = mongoose.model('questionsList', questions);

module.exports = questionsList;
