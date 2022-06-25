/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** VOLUME COMMAND */

module.exports = {
    name: 'volume',
    aliases: ['v'],
    description: 'Zmiana głośności bota',
    permissions: ['ADMINISTRATOR'],

    async run(client, prefix, msg, args) {

        let value = Number(args[0]);
        value /= 2;

        const queue = client.distube.getQueue(msg);

        if (isNaN(value) || !value) {
            msg.react('🔈'), autoDelete(msg, 20);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setTitle(`⚙️ | Ustawiona głośność: \`${queue.volume*2}%\``)
                    .setDescription('Możesz ustawić poziom głośności bota w danej sesji. Podaj wartość (w procentach) w przedziale 1-200.')
                ],
            }).then(msg => autoDelete(msg, 20));
        };

        if (value < 0.5 || value > 100) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`🔈 | Podano **niepoprawną wartość** *(w procentach)* poziomu głośności (1-200)!`)
                ],
            }).then(msg => autoDelete(msg, 20));
        };

        msg.react('✅'), autoDelete(msg, 15);

        if (queue.playing) client.distube.setVolume(msg, value);

        client.distube.on('initQueue', (queue) => {
            queue.volume = value;
        })

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription(`🔈 | Ustawiono poziom głośności: \`${value*2}%\``)
            ],
        }).then(msg => autoDelete(msg, 15));

    },
};