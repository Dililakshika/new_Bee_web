const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Assuming you have a User model set up

// Welcome page
router.get('/', (req, res) => {
    res.render('index');
});

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle Register POST request
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        // Redirect to login page after successful registration
        res.redirect('/login');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
