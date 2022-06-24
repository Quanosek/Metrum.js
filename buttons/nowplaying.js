/** IMPORT */

require('dotenv').config();

/** NOWPLAYING COMMAND BUTTON */

module.exports = {
    name: 'nowplaying',

    async run(client, interaction, params) {

        const name = params[0];
        const song = params[1];

        interaction.customLink = song;

        async function runCommand(name) {
            await client.slashCommands.get(name).run(client, interaction)
        }

        if (name === 'pause') runCommand('pause');
        if (name === 'skip') runCommand('skip');
        if (name === 'repeat') runCommand('repeat');
        if (name === 'radio') runCommand('radio');
        if (name === 'search') runCommand('search');

    },
};