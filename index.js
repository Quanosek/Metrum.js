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
console.log(realDate() + ' Bot ' + `${NAME}`.brightYellow + ' starting up...'); // log

/** MAIN DEFINE */

const { Client, Collection, MessageEmbed } = require('discord.js');

const client = new Client({
    intents: 32767,
    restTimeOffset: 0,
    shards: 'auto',
});

/** commands collections */

client.buttons = new Collection();
client.slashCommands = new Collection();
client.commands = new Collection();

const handlers = fs
    .readdirSync('./handlers')
    .filter(file => file.endsWith('.js'));

const eventFiles = fs
    .readdirSync('./clientEvents')
    .filter(file => file.endsWith('.js'));

const buttonFiles = fs
    .readdirSync('./buttons')
    .filter(file => file.endsWith('.js'));

const slashCommandsFolders = fs.readdirSync('./slashCommands');
const commandsFolders = fs.readdirSync('./commands');

/** MAIN FUNCTION */

(async() => {

    for (file of handlers) {
        require(`./handlers/${ file }`)(client);
    };

    /** handlers run */

    client.handleEvents(eventFiles, './clientEvents');
    client.handleButtons(buttonFiles, './buttons');
    client.handleSlashCommands(slashCommandsFolders, './slashCommands');
    client.handleCommands(commandsFolders, './commands');

    /** mongoose connection */

    try {
        if (!MONGO_URI) return;
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log(realDate() + ' Connected to database.'));
    } catch (err) {
        if (err) return console.error(` >>> $ { err }`.brightRed);
    };

})();

/** DISTUBE */

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

    let request = playlist.member.user;

    return queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setColor(COLOR1)
            .setThumbnail(playlist.thumbnail)
            .setTitle('➕ | Dodano do kolejki playlistę:')
            .setDescription(`
\`${playlist.name}\`

**łącznie ${playlist.songs.length} ${songs}**!
            `)
            .setFooter({ text: `dodał(a): ${request.username}`, iconURL: `${request.displayAvatarURL()}` })
            .setTimestamp()
        ],
    });
})

.on('addSong', (queue, song) => {

    if (queue.songs.length < 2) return;

    let request = song.member.user;

    return queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setColor(COLOR2)
            .setThumbnail(song.thumbnail)
            .setTitle('➕ | Dodano do kolejki:')
            .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
            .setFooter({ text: `dodał(a): ${request.username}`, iconURL: `${request.displayAvatarURL()}` })
            .setTimestamp()
        ],
    });
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

.on('initQueue', (queue) => {

    queue.paused = false;
    queue.autoplay = false;
    queue.loop = 2;
    queue.volume = 100;

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

    let request = song.member.user;

    return queue.textChannel.send({
        embeds: [new MessageEmbed()
            .setColor(COLOR2)
            .setThumbnail(`${song.thumbnail}`)
            .setTitle('🎶 | Teraz odtwarzane:')
            .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
            .setFooter({ text: `dodał(a): ${request.username}`, iconURL: `${request.displayAvatarURL()}` })
            .setTimestamp()
        ],
    });
})

/** TOKEN */

client.login(TOKEN);