// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "donate",
  description: "Link do wsparcia twórcy",

  async run(client, msgInt) {
    // print message embed
    return msgInt
      .reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR2)
            .setTitle("🪙 | Wspomóż twórcę i doceń jego pracę!")
            .setURL(process.env.DONATE)
            .setFooter({
              text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
            }),
        ],
      })
      .then(autoDelete(msgInt, 20));
  },
};
