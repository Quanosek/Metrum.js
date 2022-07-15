/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

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

            /** errors */

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

            /** execute */

            try {
                await cmd.run(client, msgInt); // run slash command

            } catch (err) { // error
                if (err) {

                    console.error(` [RUN INTERACTION] >>> ${err}`.brightRed);

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

            /** errors */

            if (!button) return; // no button

            if (!msgInt.member.permissions.has(button.permissions || [])) { // no permissions

                return msgInt.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('🛑 | Nie masz uprawnień do użycia tego przycisku!')
                    ],
                    ephemeral: true,
                });
            };

            /** execute */

            try {
                await button.run(client, msgInt, params); // run button command

            } catch (err) { // error
                if (err) {

                    console.error(` >>> [RUN BUTTON] ${err}`.brightRed);

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