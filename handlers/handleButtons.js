// import
import * as discord from "discord.js";

import "colors";
import fs from "fs";
import realDate from "../functions/realDate.js";

// buttons handler
export default (client) => {
  client.buttons = new discord.Collection();

  fs.readdirSync(`./buttons`).map((file) => {
    import(`../buttons/${file}`).then((result) => {
      const button = result.default;

      // set buttons
      try {
        client.buttons.set(button.name, button);
      } catch (err) {
        return console.error(realDate() + ` [handleButtons] ${err}`.brightRed);
      }
    });
  });
};
