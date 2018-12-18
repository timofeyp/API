const mongoose = require('mongoose')

const { Schema } = mongoose

const DiscordUser = new Schema({
  name: { type: String, required: true },
  discordId: { type: String, required: true, unique: true },
  subscribe: { type: Boolean, required: true }
})

const discordUserListSchema = mongoose.model('DiscordUserList', DiscordUser)

module.exports = discordUserListSchema
