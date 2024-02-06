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
            .setColor(client.config.color.primary)
            .setDescription("🏓 | Pong!"),
        ],
      })
      .then((results) => {
        // edit message with values
        results
          .edit({
            embeds: [
              new discord.EmbedBuilder()
                .setColor(client.config.color.secondary)
                .setTitle("🏓 | Pong!")
                .setDescription(
                  `
Opóźnienie bota: \`${results.createdTimestamp - msg.createdTimestamp} ms\`
Opóźnienie API: \`${client.ws.ping} ms\`
                  `
                )
                .setFooter({
                  text: `Autor bota: ${client.config.author.name} (${client.config.author.nick})`,
                }),
            ],
          })
          .then((msg) => autoDelete(msg));
      });
  },
};
