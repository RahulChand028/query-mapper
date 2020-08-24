let config = {}

config = {
    databases: {
        mongo: {
            url: "mongodb://localhost",
            port: "27017",
            database: "mapper"
        }
    },
    mailOptions: {
        host: "",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '',
            pass: ''
        }
    },
    timezone: "Asia/Colombo"
}

module.exports = config