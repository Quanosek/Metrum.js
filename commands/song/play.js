/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** PLAY COMMAND */

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Odtwarzanie muzyki (podaj tytuł utworu lub wklej dowolny link)',

    async run(client, prefix, msg, args) {

        /** DEFINE */

        const song = args.join(' ');

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!uservoice)
            errorEmbed.setDescription('Musisz najpierw **dołączyć** na kanał głosowy!');
        else if (msg.guild.afkChannel) {
            if (uservoice.id === msg.guild.afkChannel.id)
                errorEmbed.setDescription(`Jesteś na kanale **AFK**!`);

        } else if (botvoice) {
            if (botvoice.members.size === 1) {
                try {
                    client.distube.voices.get(msg).leave();
                } catch (err) {
                    if (err) console.error(` >>> [PLAY CMD] ${err}`.brightRed);
                };
            } else if (queue && uservoice != botvoice)
                errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');

        } else if (!song)
            errorEmbed.setDescription(`Musisz jeszcze wpisać **tytuł utworu**, albo wkleić **dowolny link**!`);

        else if (!(uservoice.permissionsFor(msg.guild.me).has('VIEW_CHANNEL') || uservoice.permissionsFor(msg.guild.me).has('CONNECT')))
            errorEmbed.setDescription(`**Nie mam dostępu** do kanału głosowego, na którym jesteś!`);
        else if (!(uservoice.permissionsFor(msg.guild.me).has('SPEAK')))
            errorEmbed.setDescription(`**Nie mam uprawnień** do aktywności głosowej na twoim kanale!`);

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        // print command message

        if (!(
                song.includes('youtu.be/') ||
                song.includes('youtube.com/') ||
                song.includes('open.spotify.com/') ||
                song.includes('soundcloud.com/')
            )) {

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`🔍 | **Szukam:** \`${song}\`, może to chwilę zająć...`)
                ],
            });
        };

        // execute command

        return client.distube.play(uservoice, song, {
            msg,
            textChannel: msg.channel,
            member: msg.member,
        });

    },
};