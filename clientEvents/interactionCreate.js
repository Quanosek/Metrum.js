/** IMPORT */

require('dotenv').config();
const { COLOR_ERR } = process.env;

require('colors');

const { MessageEmbed } = require('discord.js');

/** INTERACTION CREATE EVENT */

module.exports = {
    name: 'interactionCreate',

    async run(client, msgInt) {

        /** COMMANDS */

        if (msgInt.isCommand()) {

            /** define */

            const cmd = client.slashCommands.get(msgInt.commandName);
            msgInt.member = msgInt.guild.members.cache.get(msgInt.user.id);

            /** error */

            if (!cmd) return; // no command

            if (!msgInt.member.permissions.has(cmd.permissions || [])) { // no permissions

                return msgInt.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
                    ],
                    ephemeral: true,
                });
            };

            /** finish */

            try {
                await cmd.run(client, msgInt); // run slash command

            } catch (err) {
                if (err) {

                    console.error(` >>> ${err}`.brightRed);

                    return msgInt.reply({
                        embeds: [new MessageEmbed()
                            .setColor(COLOR_ERR)
                            .setDescription('🛑 | Pojawił się błąd podczas uruchamiania komendy!')
                        ],
                        ephemeral: true,
                    });

                };
            };

        };

        /** BUTTONS */

        if (msgInt.isButton()) {

            /** define */

            const [name, ...params] = msgInt.customId.split('-');
            const button = client.buttons.get(name);

            if (!button) return; // no button

            /** command */

            try {
                await button.run(client, msgInt, params); // run button command

            } catch (err) { // error
                if (err) {
                    console.error(` >>> ${err}`.brightRed);

                    return msgInt.reply({
                        embeds: [new MessageEmbed()
                            .setColor(COLOR_ERR)
                            .setDescription('🛑 | Pojawił się błąd podczas uruchamiania komendy!')
                        ],
                        ephemeral: true,
                    });

                };
            };

        };
    },
};