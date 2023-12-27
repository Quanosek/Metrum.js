import colors from "colors";

import db from "../functions/database.js";
import realDate from "../functions/realDate.js";

export default {
  name: "guildDelete",

  // quit from guild console log
  async run(client, guild) {
    db.delete(guild.id);

    return console.log(
      realDate() +
        " " +
        colors.gray(`Guild: "${guild.name}", ID: ${guild.id}`) +
        `\n >>> Bot ${colors.brightRed("left")} the server!`
    );
  },
};
