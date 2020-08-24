let config = {}

config = {
    mailOptions: {
        host: "",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '',
            pass: ''
        }
    },
    timezone : "Asia/Colombo"
}

module.exports = config