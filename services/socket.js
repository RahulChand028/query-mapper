let socketio = require('socket.io')

function socketInitailze(http) {

    let io = socketio(http)

}

module.exports = socketInitailze