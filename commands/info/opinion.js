import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "opinion",
  aliases: ["op"],
  description: "Link z możliwością zostawienia opinii o bocie",

  async run(client, prefix, msg, args) {
    msg.react("✅"), autoDelete(msg, 20);

    // print message embed
    return msg.channel
      .send({
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
      .then((msg) => autoDelete(msg, 20));
  },
};
