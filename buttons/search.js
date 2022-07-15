/** IMPORT */

require('dotenv').config();
const { AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** SERACH COMMAND BUTTON */

module.exports = {
    name: 'search',

    async run(client, interaction, params) {

        /** DEFINE */

        const name = params[0];
        const songId = params[1];

        const queue = client.distube.getQueue(interaction);
        const botvoice = interaction.guild.me.voice.channel;
        const uservoice = interaction.member.voice.channel;

        const result = await client.distube.search(name);

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!uservoice)
            errorEmbed.setDescription('Musisz najpierw **dołączyć** na kanał głosowy!');
        else if (interaction.guild.afkChannel) {
            if (uservoice.id === interaction.guild.afkChannel.id)
                errorEmbed.setDescription(`Jesteś na kanale **AFK**!`);

        } else if (botvoice) {
            if (botvoice.members.size === 1) {
                try {
                    client.distube.voices.get(interaction).leave();
                } catch (err) {
                    if (err) console.error(` >>> [SEARCH BUTTON] ${err}`.brightRed);
                };
            } else if (queue && uservoice != botvoice)
                errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');

        } else if (!(uservoice.permissionsFor(interaction.guild.me).has('VIEW_CHANNEL') || uservoice.permissionsFor(msgInt.guild.me).has('CONNECT')))
            errorEmbed.setDescription(`**Nie mam dostępu** do kanału głosowego, na którym jesteś!`);
        else if (!(uservoice.permissionsFor(interaction.guild.me).has('SPEAK')))
            errorEmbed.setDescription(`**Nie mam uprawnień** do aktywności głosowej na twoim kanale!`);

        if (errorEmbed.description) // print error embed
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        // print button message

        interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(`
**🎵 | ${interaction.user} wybrał(a) utwór:**

**${songId}.** [${result[songId - 1].name}](${result[songId - 1].url}) - \`${result[songId - 1].formattedDuration}\`
                `)
                .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
            ],
        });

        // execute command

        return client.distube.play(uservoice, result[songId - 1].url, {
            interaction,
            textChannel: interaction.channel,
            member: interaction.member,
        });

    },
};