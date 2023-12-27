import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "ping",
  aliases: ["pg"],
  description: "Sprawdzenie pingu bota",

  async run(client, prefix, msg, args) {
    msg.react("🏓"), autoDelete(msg);

    // print message embed
    return msg.channel
      .send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription("🏓 | Pong!"),
        ],
      })
      .then((results) => {
        // edit message with values
        results
          .edit({
            embeds: [
              new discord.EmbedBuilder()
                .setColor(process.env.COLOR2)
                .setTitle("🏓 | Pong!")
                .setDescription(
                  `
Opóźnienie bota: \`${results.createdTimestamp - msg.createdTimestamp} ms\`
Opóźnienie API: \`${client.ws.ping} ms\`
                  `
                )
                .setFooter({
                  text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
                }),
            ],
          })
          .then((msg) => autoDelete(msg));
      });
  },
};
