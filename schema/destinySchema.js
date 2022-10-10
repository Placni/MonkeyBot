const mongoose = require('mongoose');

const destinySchema = new mongoose.Schema({
    _id: { type: String },
    access_token: { type: String, default: null },
    refresh_token: { type: String, defualt: null },
    membership_id: { type: String, defualt: null },
}, { _id: false });

module.exports = mongoose.model("destinyTokens", destinySchema);