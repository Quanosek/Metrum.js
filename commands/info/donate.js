import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "donate",
  aliases: ["dn", "dt"],
  description: "Link do przekazania wsparcia dla twórcy",

  async run(client, prefix, msg, args) {
    msg.react("✅"), autoDelete(msg, 20);

    // print message embed
    return msg.channel
      .send({
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
      .then((msg) => autoDelete(msg, 20));
  },
};
