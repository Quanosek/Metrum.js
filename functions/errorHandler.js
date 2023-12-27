import discord from "discord.js";
import colors from "colors";

import realDate from "../functions/realDate.js";

export function ErrorLog(title, error) {
  return console.log(
    realDate() + " " + colors.brightRed(`[${title}] ${error}`)
  );
}

export function ErrorEmbed(error) {
  return new discord.EmbedBuilder()
    .setColor(process.env.COLOR_ERR)
    .setTitle("🛑 | Pojawił się błąd!")
    .setDescription(`${error.message}`);
}
