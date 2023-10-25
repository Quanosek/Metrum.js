// import
import dotenv from "dotenv";
dotenv.config();

import { getVoiceConnection } from "@discordjs/voice";

import "colors";
import ms from "ms";
import realDate from "../functions/realDate.js";

// define module
export default {
  name: "ready",
  once: true,

  async run(client) {
    // log
    console.log(realDate() + " Bot is ready to use!".brightYellow);

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
      console.log(realDate() + " Started refreshing slash commands...");
      //
      // GLOBALLY;
      //
      // await guild.commands.set([]); // clear all local cmd
      // console.log(
      //   realDate() + " Deleted".brightRed + " all local slash commands."
      // );

      await client.application.commands.set(client.slashCommands); // register cmd globally
      console.log(
        realDate() +
          " Registered all slash commands " +
          "globally".brightYellow +
          "."
      );
      //
      // LOCALLY;
      //
      // await client.application.commands.set([]); // clear all global cmd
      // console.log(
      //   realDate() + " Deleted".brightRed + " all global slash commands."
      // );
      //
      // await guild.commands.set(client.slashCommands); // register cmd locally
      // console.log(
      //   realDate() +
      //     " Registered all slash commands " +
      //     "locally".brightYellow +
      //     "."
      // );
    } catch (err) {
      return console.error(
        realDate() + ` [handleSlashCommands] ${err}`.brightRed
      );
    }
  },
};
