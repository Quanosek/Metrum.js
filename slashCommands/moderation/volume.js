/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** VOLUME SLASH COMMAND */

module.exports = {
    name: 'volume',
    description: 'Zmiana głośności bota',
    permissions: ['ADMINISTRATOR'],

    options: [{
        name: 'value',
        description: 'Podaj wartość (w procentach) poziom głośności',
        type: 'NUMBER',
    }],

    async run(client, msgInt) {

        let value = msgInt.options.getNumber('value');
        value /= 2;

        const queue = client.distube.getQueue(msgInt);

        if (isNaN(value) || !value) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setTitle(`⚙️ | Ustawiona głośność bota: \`${queue.volume*2}%\``)
                    .setDescription('Możesz ustawić poziom głośności bota w danej sesji. Podaj wartość (w procentach) w przedziale 1-200.')
                ],
            }).then(autoDelete(msgInt, 20));
        };

        if (value < 0.5 || value > 100) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`🔈 | Podano **niepoprawną wartość** *(w procentach)* poziomu głośności (1-200)!`)
                ],
                ephemeral: true,
            });
        };

        if (queue.playing) client.distube.setVolume(msgInt, value);

        client.distube.on('initQueue', (queue) => {
            queue.volume = value;
        })

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription(`🔈 | Ustawiono poziom głośności bota: \`${value*2}%\``)
            ],
        }).then(autoDelete(msgInt, 15));

    },
};