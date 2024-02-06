import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "donate",
  description: "Link do przekazania wsparcia dla twórcy",

  async run(client, msgInt) {
    // print message embed
    return msgInt
      .reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(client.config.color.secondary)
            .setTitle("🪙 | Przekaż symboliczną kwotę dla twórcy!")
            .setURL(client.config.website.donate)
            .setFooter({
              text: `Autor bota: ${client.config.author.name} (${client.config.author.nick})`,
            }),
        ],
      })
      .then(autoDelete(msgInt, 20));
  },
};
