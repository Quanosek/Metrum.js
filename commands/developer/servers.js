// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "servers",
  aliases: ["devs"],
  description: "Listę serwerów, na których jest bot",
  devOnly: true,

  async run(client, prefix, msg, args) {
    msg.react("✅"), autoDelete(msg, 1);

    // create embed
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR2)
      .setTitle("**🔧 | Lista serwerów, na których jestem:**");

    let number = 1;

    client.guilds.cache
      .map((guild, id) => {
        let voice = "";

        if (guild.members.me.voice.channel)
          voice = "\n >>> obecnie na kanale głosowym!";

        embed.addFields({
          name: `${number}. ${guild}`,
          value: `**ID:** ${id}\n**Właściciel:** <@${guild.ownerId}>${voice}`,
        });

        number += 1;
      })
      .slice(0, 25);

    if (number > 25)
      embed.setFooter({
        text: `...w sumie ${client.guilds.cache.size} serwerów!`,
      });

    // print message embed
    return msg.channel
      .send({ embeds: [embed] })
      .then((msg) => autoDelete(msg, 30));
  },
};
