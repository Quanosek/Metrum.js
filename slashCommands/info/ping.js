import discord from "discord.js";

export default {
  name: "ping",
  description: "Sprawdzenie pingu bota",

  async run(client, msgInt) {
    // print message embed
    msgInt
      .reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(client.config.color.primary)
            .setDescription("🏓 | Pong!"),
        ],
        ephemeral: true,
        fetchReply: true,
      })
      .then((results) => {
        // edit message with values
        msgInt.editReply({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(client.config.color.secondary)
              .setTitle("🏓 | Pong!")
              .setDescription(
                `
Opóźnienie bota: \`${results.createdTimestamp - msgInt.createdTimestamp} ms\`
Opóźnienie API: \`${client.ws.ping} ms\`
                `
              )
              .setFooter({
                text: `Autor bota: ${client.config.author.name} (${client.config.author.nick})`,
              }),
          ],
        });
      });
  },
};
