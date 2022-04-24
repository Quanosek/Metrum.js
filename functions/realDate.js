/** IMPORT */

require('colors');

/** FUNCTION */

function realDate() {

    const date = new Date()

    options = {

        timeZone: 'Europe/Brussels',

        day: 'numeric',
        month: 'numeric',
        year: 'numeric',

        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };

    /** formatted date export */

    const newDate = new Intl.DateTimeFormat('pl-PL', options).format(date);

    return `[${newDate}]`.brightCyan

};

module.exports = realDate;