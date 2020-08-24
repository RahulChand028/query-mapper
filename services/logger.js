let winston = require('winston')

let rootDir = __dirname.split('/').slice(0, -1).join('/');
let options = {
    file: {
        level: 'info', // error/warn/info/verbose/debug/silly
        filename: rootDir + '/logs/all.json',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: true,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};
let logger = new winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false,
});
// logger.log({
//     level: 'info',
//     message: 'Hello distributed log files!'
// })


log = (data) => {
    logger.log({...data, date: new Date() });
}


module.exports = { log };