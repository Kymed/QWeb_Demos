var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    post: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
});

var Post = mongoose.model('post', PostSchema);

module.exports = Post;