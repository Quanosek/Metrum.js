import Discord from "discord.js";

import fs from "fs";

import { ErrorLog } from "../functions/errorHandler.js";

export default (client) => {
  client.buttons = new Discord.Collection();

  fs.readdirSync(`./buttons`).map((file) => {
    import(`../buttons/${file}`).then((result) => {
      const button = result.default;

      // run buttons
      try {
        return client.buttons.set(button.name, button);
      } catch (err) {
        return ErrorLog("handleButtons", err);
      }
    });
  });
};
