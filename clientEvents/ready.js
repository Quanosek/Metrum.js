import dotenv from "dotenv";
dotenv.config();

import { getVoiceConnection } from "@discordjs/voice";

import ms from "ms";
import colors from "colors";

import { ErrorLog } from "../functions/errorHandler.js";
import realDate from "../functions/realDate.js";

export default {
  name: "ready",
  once: true,

  async run(client) {
    console.log(realDate() + " " + colors.brightYellow("Bot is ready to use!"));
    client.user.setActivity("Aktualizacja w drodze...", { type: 3 });
    client.user.setStatus("idle");

    // auto-leave voice channels
    const guildsID = client.guilds.cache.map((guild) => guild.id);
    setInterval(() => {
      guildsID.forEach((id) => {
        if (getVoiceConnection(id) && !client.distube.getQueue(id))
          connection.destroy();
      });
    }, ms("10m")); // delay

    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    // register slash commands
    try {
      console.log(realDate() + " " + "Started refreshing slash commands...");

      //
      // GLOBALLY;
      //

      // await guild.commands.set([]); // clear all local cmds
      // console.log(
      //   realDate() +
      //     " " +
      //     colors.brightRed("Deleted") +
      //     " " +
      //     "all local slash commands."
      // );

      // await client.application.commands.set(client.slashCommands); // register cmds globally
      // console.log(
      //   realDate() +
      //     " " +
      //     `Registered all slash commands ${colors.brightYellow("globally")}.`
      // );

      //
      // LOCALLY;
      //

      // await client.application.commands.set([]); // clear all global cmds
      // console.log(
      //   realDate() +
      //     " " +
      //     colors.brightRed("Deleted") +
      //     " " +
      //     "all global slash commands."
      // );

      await guild.commands.set(client.slashCommands); // register cmds locally
      console.log(
        realDate() +
          " " +
          `Registered all slash commands ${colors.brightYellow.underline(
            "locally"
          )}.`
      );

      return;
    } catch (err) {
      return ErrorLog("handleSlashCommands", err);
    }
  },
};
