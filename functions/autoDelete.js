// import
import "colors";
import ms from "ms";
import realDate from "./realDate.js";

// define function
export default (msg, delay) => {
  if (!msg) return;
  if (!delay) delay = "10s"; // default value
  if (!/[a-z]/.test(delay)) delay += "000"; // change to milliseconds

  if (msg.type === 0) {
    // Default
    setTimeout(() => {
      msg.delete().catch((err) => {
        if (!(err.code === 10008 || err.code === 50013))
          return console.log(realDate() + ` [autoDelete] ${err}`.brightRed);
      });
    }, ms(delay));
  } else if (msg.type === 20) {
    // ChatInputCommand
    setTimeout(() => {
      msg.deleteReply().catch((err) => {
        if (!(err.code === 10008 || err.code === 50013))
          return console.log(realDate() + ` [autoDelete] ${err}`.brightRed);
      });
    }, ms(delay));
  }
};
