/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'remove',
    aliases: ['rm', 'rv'],
    description: 'usunięcie wybranej pozycji z kolejki utworów',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!botvoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!args[0]) args[0] = 0;
        let number = Number(args[0]);

        if (!args[0]) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz jeszcze wpisać numer, który utwór z koleji chcesz usunąć!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (isNaN(number) || number > queue.songs.length || number < 1) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Wprowadź poprawną wartość!')
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');

        // number === 1

        if (number === 1) {

            if (queue.songs.length < 2) {
                if (queue.autoplay) { client.distube.skip(msg) } else { client.distube.stop(msg) };
            } else { client.distube.skip(msg) };

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color2)
                    .setDescription('🗑️ | Usunięto **obecnie odtwarzany** utwór z kolejki.')
                ]
            });

        } else {

            // number > 1

            number = number - 1;
            let song = queue.songs[number]

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color2)
                    .setTitle('🗑️ | Usunięto z kolejki utworów pozycję:')
                    .setDescription(`
**${number + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\`
          `)
                ]
            });

            return queue.songs.splice(number, 1)

        };

    }
};