const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true
    },
    age: Number,
    courses: [String],
    liked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    date: {
        type: Date,
        default: Date.now()
    }
})

var User = mongoose.model('user', UserSchema);

module.exports = User;