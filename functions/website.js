/* <--- Import & define ---> */

const clr = require('colors');
const express = require('express');
const server = express();

const realDate = require('./realDate.js')

server.all('/', (req, res) => {
    res.send('testowa strona internetowa bota Metrum'); // zawartość strony
});

/* <--- Function ---> */

function website() {
    server.listen(3000, () => {
        console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Website is online.`);
    });
};

module.exports = website;