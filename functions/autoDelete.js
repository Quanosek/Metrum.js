/** IMPORT */

require('colors');

const realDate = require('./realDate.js');

/** FUNCTION */

function autoDelete(msg, delay) {

    if (!msg) console.log(realDate() + ` Guild: ${msg.guild.name}, ID: ${msg.guild.id}`.grey + `\n >>> autoDelete Error: Message is not declared!`.red);

    if (!delay) delay = 10; // delay of deleting

    delay += '000'; // to milliseconds

    if (msg.type === 'APPLICATION_COMMAND') { // slash commands

        setTimeout(() => msg.deleteReply().catch(err => {
            if (err.code !== 10008 && err.code !== 50013) {
                console.error(realDate() + ` Guild: ${msg.guild.name}, ID: ${msg.guild.id}`.grey + `\n >>> autoDelete Error: ${err} (code: ${err.code})`.red);
            };
        }), delay);

    } else { // legacy commands

        setTimeout(() => msg.delete().catch(err => {
            if (err.code !== 10008 && err.code !== 50013) {
                console.error(realDate() + ` Guild: ${msg.guild.name}, ID: ${msg.guild.id}`.grey + `\n >>> autoDelete Error: ${err} (code: ${err.code})`.red);
            };
        }), delay);

    };
};

module.exports = autoDelete;