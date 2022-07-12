/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** VOLUME COMMAND */

module.exports = {
    name: 'volume',
    aliases: ['v'],
    description: 'Zmiana głośności bota',
    permissions: ['ADMINISTRATOR'],

    async run(client, prefix, msg, args) {

        /** DEFINE */

        const value = Number(args[0]) / 2;

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** DEFAULT COMMAND */

        if (isNaN(value) || !value) {
            msg.react('🔈'), autoDelete(msg, 60);

            const embed = new MessageEmbed()
                .setColor(COLOR1)
                .setTitle(`⚙️ | Ustawiona głośność: \`${queue.volume*2}%\``)
                .setDescription('Możesz ustawić poziom głośności bota w danej sesji. Podaj wartość (w procentach) w przedziale 1-200.')

            const buttons = new MessageActionRow() // buttons
                .addComponents(
                    new MessageButton()
                    .setCustomId(`volume-less`)
                    .setStyle('PRIMARY')
                    .setLabel(`-10%`)
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId(`volume-normal`)
                    .setStyle('SUCCESS')
                    .setLabel(`100%`)
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId(`volume-more`)
                    .setStyle('PRIMARY')
                    .setLabel(`+10%`)
                )

            return msg.channel.send({ embeds: [embed], components: [buttons] }) // print message
                .then(msg => autoDelete(msg, 60));
        };

        /** OTHER ERROR */

        if (value < 0.5 || value > 100) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`🔈 | Podano **niepoprawną wartość** *(w procentach)* poziomu głośności (\`1-200\`)!`)
                ],
            }).then(msg => autoDelete(msg, 20));
        };

        /** FINAL COMMAND */

        msg.react('✅');
        client.distube.setVolume(msg, value); //execute command

        /** print message command */

        msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription(`🔈 | Ustawiono **poziom głośności bota** na: \`${value*2}%\``)
            ],
        });

        /** event */

        client.distube.on('initQueue', (queue) => {
            return queue.volume = value;
        })

    },
};