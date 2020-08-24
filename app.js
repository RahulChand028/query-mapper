let express = require('express')
let bodyParser = require('body-parser')
let socketInitailze = require('./services/socket')
require('dotenv').config()

let apiInitialize = require('./api')
let route = require('./routes')


let app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/',apiInitialize)
app.use('/', route)

let http = require('http').createServer(app)

socketInitailze(http)

http.listen(3000, function () {
    console.log('listening on *:3000');
});