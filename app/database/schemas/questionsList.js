const mongoose = require('mongoose');

const { Schema } = mongoose;

const question = new Schema({
    num: {
        type: Number,
        required: true
    },
    text: {
        type: Number,
        required: true
    }
});

const questionsListSchema = mongoose.model('questionsList', question);

module.exports = questionsListSchema;
