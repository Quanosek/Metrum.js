/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** WATCH COMMAND */

module.exports = {
    name: 'watch',
    aliases: ['w'],
    description: 'Aktywność YouTube Watch Together',

    async run(client, prefix, msg, args) {

        //! There's no support for choose voice channel via command

        /** DEFINE */

        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!uservoice)
            errorEmbed.setDescription('Musisz najpierw **dołączyć** na kanał głosowy!');
        else if (uservoice.id === msg.guild.afkChannel.id)
            errorEmbed.setDescription('Jesteś na kanale **AFK**!');
        else if (!(uservoice.permissionsFor(msg.guild.me).has('CREATE_INSTANT_INVITE')))
            errorEmbed.setDescription(`**Nie mam uprawnień** do tworzenia zaproszeń na kanał **${uservoice}**!`);

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        client.discordTogether.createTogetherCode(uservoice.id, 'youtube') // execute command
            .then(invite => {

                // print command message

                msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor('#ff0000')
                        .setDescription(`[🪁 | **Dołącz** do aktywności "**YouTube Watch Together**" na kanale **${uservoice.name}**!](${invite.code})`)
                    ],
                });

            });

    },
};