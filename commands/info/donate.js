import dotenv from "dotenv";
dotenv.config();

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
            .setColor(process.env.COLOR2)
            .setTitle("🪙 | Przekaż symboliczną kwotę dla twórcy!")
            .setURL(process.env.DONATE)
            .setFooter({
              text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
            }),
        ],
      })
      .then((msg) => autoDelete(msg, 20));
  },
};
