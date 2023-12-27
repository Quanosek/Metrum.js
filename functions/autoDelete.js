import ms from "ms";

import { ErrorLog } from "../functions/errorHandler.js";

export default (msg, delay) => {
  if (!msg) return;

  if (!delay) delay = "10s"; // default value
  if (!/[a-z]/.test(delay)) delay += "000"; // change number to milliseconds

  const errorMessage = (err) => {
    // https://discord.com/developers/docs/topics/opcodes-and-status-codes#json
    if (
      ![
        10008, // Unknown message
        50013, // You lack permissions to perform that action
      ].includes(err.code)
    ) {
      return ErrorLog("autoDelete", err);
    }
  };

  setTimeout(() => {
    // https://discord.com/developers/docs/resources/channel#message-object-message-types

    if (msg.type === 20) {
      return msg.deleteReply().catch((err) => errorMessage(err));
    } else {
      return msg.delete().catch((err) => errorMessage(err));
    }
  }, ms(delay));
};
