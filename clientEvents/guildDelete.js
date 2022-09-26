// import
import "colors";
import db from "../functions/database.js";
import realDate from "../functions/realDate.js";

// define module
export default {
  name: "guildDelete",

  async run(client, guild) {
    db.delete(guild.id); // delete db

    // log
    console.log(
      realDate() +
        ` Guild: ${guild.name}, ID: ${guild.id}`.grey +
        "\n >>> Bot " +
        "left".brightRed +
        " the server!"
    );
  },
};
