const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    _id: {type: String},
    prefix: {type: String, default: process.env.PREFIX},
    trackedwords: {type: Array, defualt: []},
    blacklist: {type: Array, default: []},
    userinfo: {type: Object, default: {ph: 'ph'}}
}, {_id: false});

module.exports = mongoose.model("guildSettings", guildSchema);