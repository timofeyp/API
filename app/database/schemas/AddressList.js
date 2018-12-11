const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressList = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
});

const address= mongoose.model('addresslist', addressList);

module.exports = address;
