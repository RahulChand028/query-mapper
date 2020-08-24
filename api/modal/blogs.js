let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let blogSchema = new Schema({
    title: String,
    author: mongoose.Types.ObjectId,
    body: String,
    comments: [{
        user: mongoose.Types.ObjectId,
        body: String,
        date: Date
    }],
    date: { type: Date, default: Date.now },
    meta: {
        votes: Number,
        favs: Number
    }
});


module.exports = mongoose.model('Blogs', blogSchema);