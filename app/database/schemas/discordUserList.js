const mongoose = require('mongoose');

const { Schema } = mongoose;

const discordUser= new Schema({
    name: { type: String, required: true },
    discordId: { type: String, required: true, unique: true },
});

const discordUserListSchema= mongoose.model('discordUserList', discordUser);

module.exports = discordUserListSchema;
