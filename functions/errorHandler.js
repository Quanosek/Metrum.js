import discord from "discord.js";
import fs from "fs";
import colors from "colors";

import realDate from "../functions/realDate.js";

const config = JSON.parse(fs.readFileSync("./.secret/config.json"));

export function ErrorLog(title, error) {
  return console.log(
    realDate() + " " + colors.brightRed(`[${title}] ${error}`)
  );
}

export function ErrorEmbed(error) {
  return new discord.EmbedBuilder()
    .setColor(config.color.error)
    .setTitle("🛑 | Pojawił się błąd!")
    .setDescription(`${error.message}`);
}
