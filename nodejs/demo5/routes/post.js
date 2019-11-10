/**
 * INTERFACE
 * 
 * GET /post                          (get all posts)
 * 
 * POST /post                         (add a new post)
 * 
 * GET /post/:id                      (get a post by id)
 * 
 * DELETE /post/:id                   (delete a post by id)
 * 
 * PUT /post/like/:userid/:postid     (like a user's post)
 * 
 * DELETE /post/comment/:postid       (delete a comment on a post)
 */

// Bring in Express
const express = require('express');
const router = express.Router();

// Bring in Database models
const User = require('../models/User');
const Post = require('../models/Post');

// @route POST /post
// @desc  Create a new post
router.post('/', async (req, res) => {
    try {
        const { user, text } = req.body;

        if (user.trim() === "" || text.trim() === "") {
            return res.status(400).json({ msg: "You must include a user & post" });
        }

        const postFields = {
            user,
            post: text
        }

        // Add to the database
        const post = new Post(postFields);
        await post.save();
        res.json({ msg: `Post added to the database`});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @route GET /post
// @desc  Get all posts
router.get('/', async (req, res) => {
    try {

        const posts = await Post.find();
        res.json(posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @route GET /post/:id
// @desc  Get a specific post by their ID
router.get('/:id', async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);
        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @route DELETE /post/:id
// @desc  Delete a post by their id
router.delete('/:postid/:userid', async(req, res) => {
    try {

        const post = await Post.findById(req.params.postid);

        // See if the post exists first
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (req.params.userid !== post.user.toString()) {
            return res.status(401).json({ msg: "This is not your post" });
        }

        /**
         *  Note:
         *  In general, our endpoints are barely protected. When we get 
         *  into authentication in a later tutorial. You'll understand how to
         *  really protect routes (using more than just IDs) and have
         *  login/logout accounts for client sessions. Though it's better
         *  you learn React first.
         */

        await post.remove();
        res.json({ msg: `Post has been deleted from the database` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @route PUT /post/like/:userid/:postid
// @desc  Like a user's post
router.put('/like/:userid/:postid', async (req, res) => {
    try {

        // Get the post and check if it exists
        const post = await Post.findById(req.params.postid);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Get the user and check if it exists
        const user = await User.findById(req.params.userid);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if the user already liked the post
        if (user.liked.includes(req.params.postid)) {
            return res.status(400).json({ msg: "User already liked the post" })
        }

        // Add the post to the user's "liked array"
        user.liked.push(req.params.postid);
        await user.save();

        // Add a like to the post
        post.likes += 1;
        await post.save();

        // Respond to the client
        res.json({ msg: `${req.params.userid} has successfully liked ${req.params.postid}`});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
})

module.exports = router;