const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('passport')

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
