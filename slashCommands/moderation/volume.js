/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

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

        /** DEFINE */

        const value = msgInt.options.getNumber('value') / 2;

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** DEFAULT COMMAND */

        if (isNaN(value) || !value) {

            const embed = new MessageEmbed() // message content
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

            return msgInt.reply({ embeds: [embed], components: [buttons] }) // print message
                .then(autoDelete(msgInt, 60));
        };

        /** OTHER ERROR */

        if (value < 0.5 || value > 100) {

            msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription(`🔈 | Podano **niepoprawną wartość** *(w procentach)* poziomu głośności (\`1-200\`)!`)
                ],
                ephemeral: true,
            });
        };

        /** FINAL COMMAND */

        client.distube.setVolume(msgInt, value); // execute command

        /** print message command */

        msgInt.reply({
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