let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    gender: {
        type: String,
        enum: ['Male', 'female']
    },
    age: {
        type: Number,
        max: 100
    },
    dob: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Users', userSchema);