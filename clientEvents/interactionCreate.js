/** IMPORT */

require('dotenv').config();
const { COLOR_ERR } = process.env;

require('colors');

const { MessageEmbed } = require('discord.js');

/** INTERACTION CREATE EVENT */

module.exports = {
    name: 'interactionCreate',

    async run(client, interaction) {

        /** COMMANDS */

        if (interaction.isCommand()) {

            /** define */

            const cmd = client.slashCommands.get(interaction.commandName);
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);

            /** error */

            if (!cmd) return; // no command

            if (!interaction.member.permissions.has(cmd.permissions || [])) { // no permissions

                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
                    ],
                    ephemeral: true,
                });
            };

            /** finish */

            try {
                await cmd.run(client, interaction); // run slash command

            } catch (err) {
                if (err) {

                    console.error(` >>> ${err}`.brightRed);

                    return interaction.reply({
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

        if (interaction.isButton()) {

            /** define */

            const [name, ...params] = interaction.customId.split('-');
            const button = client.buttons.get(name);

            if (!button) return; // no button

            /** command */

            try {
                await button.run(client, interaction, params); // run button command

            } catch (err) { // error
                if (err) {
                    console.error(` >>> ${err}`.brightRed);

                    return interaction.reply({
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