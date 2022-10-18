// import
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "guildowners",
  aliases: ["devg"],
  description: "Wiadomość do wszystkich właścicieli serwerów",
  devOnly: true,

  async run(client, prefix, msg, args) {
    msg.react("✅"), autoDelete(msg, 1);

    // console.log("test");
  },
};
