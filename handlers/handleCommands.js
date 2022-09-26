// import
import * as discord from "discord.js";

import "colors";
import fs from "fs";
import realDate from "../functions/realDate.js";

// commands handler
export default (client) => {
  (async () => {
    client.commands = new discord.Collection();

    fs.readdirSync(`./commands`).map((folder) => {
      fs.readdirSync(`./commands/${folder}`).map((file) => {
        import(`../commands/${folder}/${file}`).then((result) => {
          const cmd = result.default;
          // set commands
          try {
            client.commands.set(cmd.name, cmd);
          } catch (err) {
            return console.log(
              realDate() + ` [handleCommands] ${err}`.brightRed
            );
          }
        });
      });
    });
  })();
};
