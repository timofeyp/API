const mongoose = require('mongoose');

const { Schema } = mongoose;

const discordUser= new Schema({
    name: { type: String, required: true },
    discordId: { type: String, required: true, unique: true },
});

const discordUserList= mongoose.model('discordUserList', discordUser);

module.exports = discordUserList;
