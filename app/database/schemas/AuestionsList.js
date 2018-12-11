const mongoose = require('mongoose');

const { Schema } = mongoose;

const question = new Schema({
    num: {
        type: Number,
        unique: true,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

const questionsListSchema = mongoose.model('questionsList', question);

module.exports = questionsListSchema;
