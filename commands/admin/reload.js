/* <--- Import ---> */

require('dotenv').config();
const glob = require('glob');
const clr = require('colors');
const { Permissions, MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');
const realDate = require('../../functions/realDate.js')


/* <--- Command ---> */

module.exports = {
    name: 'reload',
    aliases: ['rl', 'refresh', 'rf'],
    category: 'admin',
    description: 'odświeżenie wszystkich komend bota (globalnie)',

    async run(client, msg, args, prefix) {

        /* <--- admin ---> */

        if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color_err)
                    .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');
        msgAutoDelete(msg);

        client.commands.sweep(() => true);

        glob(`${__dirname}/../**/*.js`, async(error, filePaths) => {

            filePaths.forEach(file => {

                delete require.cache[require.resolve(file)];
                const pull = require(file);
                if (pull.name) client.commands.set(pull.name, pull);

            })
        });

        console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Guild: ${msg.guild.name}, ${msg.guild.id}\n>> All commands have been globaly ` + clr.brightYellow(`refreshed`) + `.`);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.color1)
                .setDescription('🔃 | Odświeżono wszystkie moje komendy (globalnie).')
            ]
        }).then(msg => msgAutoDelete(msg));

    }
};