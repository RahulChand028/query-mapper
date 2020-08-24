const nodemailer = require("nodemailer");
let { mailOptions } = require('../config')

let transporter = nodemailer.createTransport(mailOptions);


module.exports = transporter
