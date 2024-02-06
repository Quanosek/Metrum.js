import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "invite",
  description: "Link z zaproszeniem bota",

  async run(client, msgInt) {
    // print message embed
    return msgInt
      .reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(client.config.color.secondary)
            .setTitle("📧 | Zaproś mnie na swój serwer!")
            .setURL(client.config.bot.invite)
            .setFooter({
              text: `Autor bota: ${client.config.author.name} (${client.config.author.nick})`,
            }),
        ],
      })
      .then(autoDelete(msgInt, 20));
  },
};
