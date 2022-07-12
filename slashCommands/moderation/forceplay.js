/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** FORCE PLAY SLASH COMMAND */

module.exports = {
    name: 'forceplay',
    description: 'Wymuszenie puszczenia podanego utworu (podaj tytuł utworu lub wklej dowolny link)',
    permissions: ['MANAGE_MESSAGES'],

    options: [{
        name: 'song',
        description: 'Podaj tytuł utworu lub wklej dowolny link',
        type: 'STRING',
        required: true,
    }],

    async run(client, msgInt) {

        /** DEFINE */

        const song = msgInt.options.getString('song');

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!uservoice)
            errorEmbed.setDescription('Musisz najpierw **dołączyć** na kanał głosowy!');
        else if (uservoice.id === msgInt.guild.afkChannel.id)
            errorEmbed.setDescription(`Jesteś na kanale **AFK**!`);

        else if (botvoice) {
            if (botvoice.members.size === 1) {
                try {
                    client.distube.voices.get(msgInt).leave();
                } catch (err) {
                    if (err) console.error(` >>> ${err}`.brightRed);
                };
            } else if (queue && uservoice != botvoice)
                errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');

        } else if (!(uservoice.permissionsFor(msgInt.guild.me).has('VIEW_CHANNEL') || uservoice.permissionsFor(msgInt.guild.me).has('CONNECT')))
            errorEmbed.setDescription(`**Nie mam dostępu** do kanału głosowego, na którym jesteś!`);
        else if (!(uservoice.permissionsFor(msgInt.guild.me).has('SPEAK')))
            errorEmbed.setDescription(`**Nie mam uprawnień** do aktywności głosowej na twoim kanale!`);

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        // print command message

        if (
            song.includes('youtu.be/') ||
            song.includes('youtube.com/') ||
            song.includes('open.spotify.com/') ||
            song.includes('soundcloud.com/')
        ) {
            msgInt.reply(song);

        } else {

            msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`🔍 | **Szukam:** \`${song}\`, może to chwilę zająć...`)
                ],
            });
        };

        // execute command

        return client.distube.play(uservoice, song, {
            msgInt,
            textChannel: msgInt.channel,
            member: msgInt.member,
            skip: true,
        });

    },
};