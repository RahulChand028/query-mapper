let mongoose = require('mongoose');
let { databases } = require('../config');
let logger = require('./logger');

async function connect() {
    try {
        await mongoose.connect(databases.mongo.url + ":" + databases.mongo.port + "/" + databases.mongo.database, { useNewUrlParser: true, useUnifiedTopology: true });
        logger.log({
            level: 'info',
            message: 'Database connected'
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: 'database connction error' + error
        });
    }
}

module.exports = connect;