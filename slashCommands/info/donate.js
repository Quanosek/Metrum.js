import dotenv from "dotenv";
dotenv.config();

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
            .setColor(process.env.COLOR2)
            .setTitle("🪙 | Przekaż symboliczną kwotę dla twórcy!")
            .setURL(process.env.DONATE)
            .setFooter({
              text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
            }),
        ],
      })
      .then(autoDelete(msgInt, 20));
  },
};
