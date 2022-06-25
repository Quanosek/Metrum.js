/** IMPORT */

require('dotenv').config();
const { NAME, TOKEN, COLOR_ERR, COLOR1, COLOR2, MONGO_URI } = process.env;

require('colors');
const fs = require('fs');
const mongoose = require('mongoose');

const autoDelete = require('./functions/autoDelete.js')
const realDate = require('./functions/realDate.js')

/** ON RUN */

console.clear(); // start with clear terminal
console.log(realDate() + ' Bot ' + `${NAME}`.brightYellow + ' is starting up...'); // log

/** MAIN DEFINE */

const { Client, MessageEmbed } = require('discord.js');

const client = new Client({ // define client
    intents: 32767,
    restTimeOffset: 0,
    shards: 'auto',
});

/** handlers define */

const handlers = fs
    .readdirSync('./handlers')
    .filter(file => file.endsWith('.js'));

/** MAIN FUNCTION */

(async() => {

    /** handlers run*/

    for (file of handlers) {
        require(`./handlers/${ file }`)(client);
    };

    client.handleEvents('clientEvents');
    client.handleButtons('buttons');
    client.handleSlashCommands('slashCommands');
    client.handleCommands('commands');

    /** mongoose connection */

    try {
        if (!MONGO_URI) return;
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log(realDate() + ' Successfully connected to the database.'));
    } catch (err) {
        if (err) return console.error(` >>> ${err}`.brightRed);
    };

})();

/** DISTUBE DEFINE */

const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');

client.distube = new DisTube(client, {
    plugins: [new YtDlpPlugin(), new SoundCloudPlugin(), new SpotifyPlugin()],
    emitNewSongOnly: true,
    leaveOnStop: false,
    searchSongs: 10,
    youtubeDL: false,
    nsfw: true,
});

client.distube.setMaxListeners(99);

/** DISTUBE EVENTS */

client.distube

    .on('addList', (queue, playlist) => {

    let songs;
    let rest = playlist.songs.length % 10;

    if (playlist.songs.length === 1) songs = 'utwór'
    else if (rest < 2 || rest > 4) songs = 'utworów'
    else if (rest > 1 || rest < 5) songs = 'utwory'

    return queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setColor(COLOR1)
            .setThumbnail(playlist.thumbnail)
            .setTitle('➕ | Dodano do kolejki playlistę:')
            .setDescription(`
\`${playlist.name}\`

**łącznie ${playlist.songs.length} ${songs}**!
            `)
        ],
    });
})

.on('addSong', (queue, song) => {

    if (queue.songs.length < 2) return;

    const embed = new MessageEmbed()
        .setColor(COLOR2)
        .setThumbnail(song.thumbnail)

    if (queue.added) {
        queue.added = false;
        embed.setTitle('➕ | Dodano do kolejki jako następny:');
        embed.setDescription(`**2.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``);
        if (queue.songs.length > 2) embed.setFooter({ text: `Utworów w kolejce: ${queue.songs.length}` });

    } else {
        embed.setTitle('➕ | Dodano do kolejki:');
        embed.setDescription(`**${queue.songs.length}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``);
    };

    return queue.textChannel.send({ embeds: [embed] })
})

.on("error", (channel, err) => {

    console.error(` >>> ${err}`.brightRed);

    return channel.send({
        embeds: [new MessageEmbed()
            .setColor(COLOR_ERR)
            .setDescription(`${err}`)
        ],
    }).then(msg => autoDelete(msg));
})

.on('noRelated', (queue) => {

    return queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setColor(COLOR_ERR)
            .setDescription('Nie znaleziono podobnych utworów.')
        ],
    }).then(msg => autoDelete(msg));
})

.on('playSong', (queue, song) => {

    client.distube.setSelfDeaf;

    let requester = song.member.user;

    return queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setColor(COLOR2)
            .setThumbnail(`${song.thumbnail}`)
            .setTitle('🎶 | Teraz odtwarzane:')
            .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
            .setFooter({ text: `dodał(a): ${requester.username}`, iconURL: `${requester.displayAvatarURL()}` })
        ],
    });
})

/** TOKEN */

client.login(TOKEN);