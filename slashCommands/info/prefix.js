import discord from "discord.js";

import db from "../../functions/database.js";

// command module
export default {
  name: "prefix",
  description: "Sprawdzenie prefixu bota",

  async run(client, msgInt) {
    // define
    const prefix = db.read(msgInt.guild.id).prefix;

    // print message embed
    msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(client.config.color.primary)
          .setDescription(`⚙️ | Mój prefix to: \`${prefix}\``)
          .setFooter({
            text: `Autor bota: ${client.config.author.name} (${client.config.author.nick})`,
          }),
      ],
      ephemeral: true,
    });
  },
};
