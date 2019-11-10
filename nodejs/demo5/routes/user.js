/**
 * INTERFACE
 * 
 * GET /user              (get all users)
 * 
 * POST /user             (add a new user)
 * 
 * GET /user/:id          (get a user by id)
 * 
 * GET /user/byName/:name (get a user by their name)
 * 
 * DELETE /user/:id       (delete a user by id)
 */

// Bring in Express
const express = require('express');
const router = express.Router();

// Bring in Database Model
const User = require('../models/User');

// @route POST /user
// @desc  Create a new user
router.post('/', async (req, res) => {
    try {
        const { name, age, courses } = req.body;

        // Note there are libraries like express-validator that make complex validation easier
        if (name.trim() === "") {
            return res.status(400).json({ msg: "You must include a name" });
        }

        const userFields = { 
            name,
            courses: []
        };

        // Check if the post request included an age before setting the field
        if (age) userFields.age = age;

        // Parse into an array
        if (courses) userFields.courses = courses.split(',');

        // Add to the database
        const user = new User(userFields);
        await user.save();
        res.json({ msg: `User ${name} created to the database`});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @route GET /user
// @desc  Get all users
router.get('/', async (req, res) => {
    try {

        const users = await User.find();
        res.json(users);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @route GET /user/:id
// @desc  Get a specific user by their ID
router.get('/:id', async (req, res) => {
    try {

        const user = await User.findById(req.params.id);
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @route GET /user/byName/:name
// @desc  Get a specific user by their name
router.get('/byName/:name', async (req, res) => {
    try {

        const users = await User.find({ name: req.params.name });
        res.json(users);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// @route DELETE /user/:id
// @desc  Delete a user by their id
router.delete('/:id', async(req, res) => {
    try {

        const user = await User.findById(req.params.id);

        // See if the user exists first
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        await user.remove();
        res.json({ msg: `${req.params.id} has been deleted from the database` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

module.exports = router;