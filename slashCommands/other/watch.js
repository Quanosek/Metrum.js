/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** WATCH SLASH COMMAND */

module.exports = {
    name: 'watch',
    description: 'Aktywność YouTube Watch Together',

    options: [{
        name: 'channel',
        description: 'Wybierz kanał głosowy aktywności',
        type: 'CHANNEL',
        channelTypes: ['GUILD_VOICE'],
    }],

    async run(client, msgInt) {

        /** DEFINE */

        const channel = msgInt.options.getChannel('channel');

        const uservoice = msgInt.member.voice.channel;

        if (channel) chosen = channel;
        else chosen = uservoice;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!chosen)
            errorEmbed.setDescription('**Dołącz** na kanał głosowy lub go **wybierz**!');
        else if (msgInt.guild.afkChannel) {
            if (uservoice.id === msgInt.guild.afkChannel.id)
                errorEmbed.setDescription(`Jesteś na kanale **AFK**!`);
        } else if (!(chosen.permissionsFor(msgInt.guild.me).has('CREATE_INSTANT_INVITE')))
            errorEmbed.setDescription(`**Nie mam uprawnień** do tworzenia zaproszeń na kanał **${chosen}**!`);

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        client.discordTogether.createTogetherCode(chosen.id, 'youtube') // execute command
            .then(invite => {

                // print command message

                msgInt.reply({
                    embeds: [new MessageEmbed()
                        .setColor('#ff0000')
                        .setDescription(`[🪁 | **Dołącz** do aktywności "**YouTube Watch Together**" na kanale **${chosen.name}**!](${invite.code})`)
                    ],
                });

            });

    },
};