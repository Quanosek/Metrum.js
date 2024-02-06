import dotenv from "dotenv";
dotenv.config();

import fs from "fs";

// database local path
const JSONpath = `./.secret/database.json`;

// open json file
const JSONopen = () => {
  return JSON.parse(fs.readFileSync(JSONpath));
};

// search guild params by ID
const dbSearch = (database, guildID) => {
  return database.indexOf(database.find((guild) => guild.id === guildID));
};

// save json file
const JSONsave = (database) => {
  const JSONnew = JSON.stringify(database);
  fs.writeFileSync(JSONpath, JSONnew);
};

export default {
  // read params of specific guild in database by id
  read(guildID) {
    const database = JSONopen();
    const guildIndex = dbSearch(database, guildID);

    if (guildIndex > -1) return database[guildIndex];
  },

  // create guild params in database file
  create(guildID, options) {
    const database = JSONopen();

    if (dbSearch(database, guildID) === -1) database.push({ id: guildID });
    const guildIndex = dbSearch(database, guildID);

    if (options.prefix) database[guildIndex].prefix = options.prefix;
    else return console.error("Wrong option name!", options);

    JSONsave(database);
    return database[guildIndex];
  },

  // delete guild from database
  delete(guildID) {
    const database = JSONopen();
    const guildIndex = dbSearch(database, guildID);

    if (guildIndex > -1) database.splice(guildIndex, 1);
    JSONsave(database);
  },

  set: {
    // change prefix on server
    prefix(guildID, newPrefix) {
      const database = JSONopen();
      const guildIndex = dbSearch(database, guildID);

      if (guildIndex > -1) database[guildIndex].prefix = newPrefix;
      JSONsave(database);
    },
  },

  // return size of json database
  size() {
    const database = JSONopen();
    return database.length;
  },
};
