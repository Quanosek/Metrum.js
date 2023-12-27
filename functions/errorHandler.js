import Discord from "discord.js";

import colors from "colors";

import realDate from "../functions/realDate.js";

export function ErrorLog(title, error) {
  console.log(
    realDate() +
      " " +
      colors.gray(`Guild: "${guild.name}", ID: ${guild.id}`) +
      `\n >>> Bot ${colors.brightGreen("joined")} to the server!`
  );

  return console.log(
    realDate() + " " + colors.brightRed(`[${title}] ${error}`)
  );
}

export function ErrorEmbed(error) {
  return new Discord.EmbedBuilder()
    .setColor(process.env.COLOR_ERR)
    .setTitle("🛑 | Pojawił się błąd!")
    .setDescription(`${error.message}`);
}
