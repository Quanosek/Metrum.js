import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import db from "../../functions/database.js";

// command module
export default {
  name: "prefix",
  description: "Pokazuje prefix bota",

  async run(client, msgInt) {
    // define
    const prefix = db.read(msgInt.guild.id).prefix;

    // print message embed
    msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription(`⚙️ | Mój prefix to: \`${prefix}\``)
          .setFooter({
            text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
          }),
      ],
      ephemeral: true,
    });
  },
};
