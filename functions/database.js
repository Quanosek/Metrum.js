// import
import dotenv from "dotenv";
dotenv.config();

import "colors";
import fs from "fs";
import JSONbig from "json-bigint";

// database source path
const JSONpath = `./.files/database.json`;

// export default module

export default {
  read(guildID) {
    const database = JSONopen();
    const guildIndex = dbSearch(database, guildID);

    if (guildIndex > -1) return database[guildIndex]; // execute command
  },

  create(guildID, options) {
    const database = JSONopen();

    if (dbSearch(database, guildID) === -1) database.push({ id: guildID });
    const guildIndex = dbSearch(database, guildID);

    // execute command
    if (options.prefix) database[guildIndex].prefix = options.prefix;
    else return console.error("Wrong option name.".red, options);

    JSONsave(database);
    return database[guildIndex];
  },

  delete(guildID) {
    const database = JSONopen();
    const guildIndex = dbSearch(database, guildID);

    // execute command
    if (guildIndex > -1) database.splice(guildIndex, 1);
    JSONsave(database);
  },

  set: {
    prefix(guildID, newPrefix) {
      const database = JSONopen();
      const guildIndex = dbSearch(database, guildID);

      // execute command
      if (guildIndex > -1) database[guildIndex].prefix = newPrefix;
      JSONsave(database);
    },
  },

  size() {
    const database = JSONopen();

    // execute command
    return database.length;
  },
};

// define helpful functions

function JSONopen() {
  const JSONstring = fs.readFileSync(JSONpath);
  return JSONbig.parse(JSONstring);
}

function dbSearch(database, guildID) {
  return database.indexOf(database.find((guild) => guild.id === guildID));
}

function JSONsave(database) {
  const JSONnew = JSON.stringify(database);
  fs.writeFileSync(JSONpath, JSONnew);
}
