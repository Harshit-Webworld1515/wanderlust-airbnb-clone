const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js")

router.get('/signup', (req, res) => {
    res.render('users/signup');
});
router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log("Registered user:", registeredUser);
        req.flash('success', 'Welcome to Wanderlust!');
        res.redirect('/listings');
    } catch (err) {
        console.error('Error during user registration:', err);
        req.flash('error', err.message);
        res.redirect('/signup');
    }
}));

module.exports = router;