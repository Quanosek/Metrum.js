import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "invite",
  aliases: ["inv", "iv"],
  description: "Link z zaproszeniem bota",

  async run(client, prefix, msg, args) {
    msg.react("✅"), autoDelete(msg, 20);

    // print message embed
    return msg.channel
      .send({
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
      .then((msg) => autoDelete(msg, 20));
  },
};
