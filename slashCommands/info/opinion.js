import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "opinion",
  description: "Link z możliwością zostawienia opinii o bocie",

  async run(client, msgInt) {
    // print message embed
    return msgInt
      .reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR2)
            .setTitle("📣 | Podziel się swoją opinią na temat bota!")
            .setURL(process.env.OPINION)
            .setFooter({
              text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
            }),
        ],
      })
      .then(autoDelete(msgInt, 20));
  },
};
