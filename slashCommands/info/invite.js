// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "invite",
  description: "Link z zaproszeniem bota",

  async run(client, msgInt) {
    // print message embed
    return msgInt
      .reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR2)
            .setTitle("📧 | Zaproś mnie na swój serwer!")
            .setURL(process.env.INVITE)
            .setFooter({
              text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK}#${process.env.AUTHOR_HASH})`,
            }),
        ],
      })
      .then(autoDelete(msgInt, 20));
  },
};
