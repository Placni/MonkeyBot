const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    _id: {type: String},
    prefix: {type: String, default: '-'}
}, {_id: false});

module.exports = mongoose.model("guildSettings", guildSchema);