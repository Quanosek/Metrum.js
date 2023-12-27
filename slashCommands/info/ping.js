import dotenv from "dotenv";
dotenv.config();

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
            .setColor(process.env.COLOR1)
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
              .setColor(process.env.COLOR2)
              .setTitle("🏓 | Pong!")
              .setDescription(
                `
Opóźnienie bota: \`${results.createdTimestamp - msgInt.createdTimestamp} ms\`
Opóźnienie API: \`${client.ws.ping} ms\`
                `
              )
              .setFooter({
                text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
              }),
          ],
        });
      });
  },
};
