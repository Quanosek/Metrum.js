/** IMPORT */

const { Schema, model } = require('mongoose');

/** SCHEMA */

const schema = new Schema({

    guildId: String,
    prefix: String,

});

module.exports = model('guilds', schema);