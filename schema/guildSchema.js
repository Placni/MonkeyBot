const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    _id: {type: String},
    prefix: {type: String, default: '-'},
    trackedwords: {type: Array},
    blacklist: {type: Array},
    userinfo: {type: Object, require: true}
}, {_id: false});

module.exports = mongoose.model("guildSettings", guildSchema);