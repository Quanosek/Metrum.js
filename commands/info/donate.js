// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "donate",
  aliases: ["dn", "dt"],
  description: "Link do wsparcia twórcy",

  async run(client, prefix, msg, args) {
    msg.react("✅"), autoDelete(msg, 20);

    // print message embed
    return msg.channel
      .send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR2)
            .setTitle("🪙 | Wspomóż twórcę i doceń jego pracę!")
            .setURL(process.env.DONATE)
            .setFooter({
              text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK}#${process.env.AUTHOR_HASH})`,
            }),
        ],
      })
      .then((msg) => autoDelete(msg, 20));
  },
};
