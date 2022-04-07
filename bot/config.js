const config = () => {
    const settings = require('./settings.json')
    const name = settings.metrumdev // bot's name: metrum1, metrum2, metrum3, metrumdev
    return name;
};

exports.config = config;