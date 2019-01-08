const mongoose = require('mongoose')

const { Schema } = mongoose

const DiscordUser = new Schema({
  name: { type: String, required: true },
  discordId: { type: String, required: true, unique: true },
  subscribe: { type: Boolean, required: true },
  reports: [{ type: Schema.Types.ObjectId, ref: 'ReportList' }]
})

const DiscordUserListSchema = mongoose.model('DiscordUserList', DiscordUser)

module.exports = DiscordUserListSchema
