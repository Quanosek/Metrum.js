/* <--- Import ---> */

const { Permissions, MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'stop',
    aliases: ['st', 'destroy', 'break'],
    category: 'admin',
    description: 'zatrzymanie awaryjne bota',

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

        /* <--- errors ---> */

        const botvoice = msg.guild.me.voice.channel
        const uservoice = msg.member.voice.channel

        if (botvoice && (!uservoice || botvoice != uservoice)) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');
        msgAutoDelete(msg);

        const connection = getVoiceConnection(msg.guild.id)
        connection.destroy();

        client.distube.stop(msg)

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.color1)
                .setDescription('✋ | Zatrzymano awaryjnie bota.')
            ]
        }).then(msg => msgAutoDelete(msg));

    }
};