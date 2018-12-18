const mongoose = require('mongoose')

const { Schema } = mongoose

const Question = new Schema({
  num: {
    type: Number,
    unique: true,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})

const questionsListSchema = mongoose.model('QuestionsList', Question)

module.exports = questionsListSchema
