// button module
export default {
  name: "nowplaying",

  async run(client, interaction, params) {
    // define
    const name = params[0];
    const song = params[1];

    // execute command
    interaction.customLink = song;
    await client.slashCommands.get(name).run(client, interaction);
  },
};
