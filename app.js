let express = require('express')
let bodyParser = require('body-parser');
let connectDb = require('./services/db');
let logger = require('./services/logger');
let socketInitailze = require('./services/socket');
require('dotenv').config();

let apiInitialize = require('./api');
let route = require('./routes');


let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/', apiInitialize);
app.use('/', route);

let http = require('http').createServer(app);
socketInitailze(http);
connectDb();
http.listen(3000, function() {
    logger.log({ level: 'info', message: 'Server started' });
});