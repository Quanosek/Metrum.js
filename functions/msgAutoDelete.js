/* <--- Import ---> */

const clr = require('colors');


/* <--- Function ---> */

function msgAutoDelete(msg, delay) {

    if (!msg) console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Guild: ${msg.guild.name}, ${msg.guild.id}\n>> On msgAutoDelete: ` + clr.Red(`'msg' is not declared`) + `!`);

    if (!delay) delay = 10

    delay += '000' // seconds to miliseconds

    setTimeout(() => msg.delete().catch(err => {
        if (err.code !== 10008) {
            console.error(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Guild: ${msg.guild.name}, ${msg.guild.id}\n>> On msgAutoDelete: ` + clr.Red(`Failed to delete the message (code ${err.code})`) + `!`);
        }
    }), delay)

};

module.exports = msgAutoDelete;