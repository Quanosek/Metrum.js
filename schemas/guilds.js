/** IMPORT */

const { Schema, model } = require('mongoose');

/** SCHEMA */

const schema = new Schema({

    guildId: Number,
    prefix: String,
    volume: Number,

});

module.exports = model('guilds', schema);