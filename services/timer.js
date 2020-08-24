let moment = require('moment')
let tz = require('moment-timezone')

let config = require('../config')

module.exports = (timezone, time) => {
    return timezone ? moment(time).tz(timezone) : moment(time).tz(config.timezone)
}

//timer('', '20111031').format('MMMM Do YYYY, dddd LTS h:mm:ss a')
//timer().subtract(10, 'days').calendar();
// timer('', '20111031').clone().tz("America/Los_Angeles")
//timer().startOf('hour').fromNow();
//jun.tz('Asia/Tokyo').format('ha z');           // 9pm JST
