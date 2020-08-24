let winston = require('winston')

let options = {
    file: {
        level: 'info',    // error/warn/info/verbose/debug/silly
        filename: '/home/blueball/workspace/nodeX/logs/all.json',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
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

module.exports = logger;