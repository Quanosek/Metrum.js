import discord from "discord.js";
import fs from "fs";

import { ErrorLog } from "../functions/errorHandler.js";

export default (client) => {
  client.commands = new discord.Collection();

  fs.readdirSync(`./commands`).map((folder) => {
    fs.readdirSync(`./commands/${folder}`).map((file) => {
      import(`../commands/${folder}/${file}`).then((result) => {
        const cmd = result.default;

        // run commands
        try {
          return client.commands.set(cmd.name, cmd);
        } catch (err) {
          return ErrorLog("handleCommands", err);
        }
      });
    });
  });
};
