const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require('../middleware.js');

router.get('/signup', (req, res) => {
    res.render('users/signup');
});
router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log("Registered user:", registeredUser);
        req.login(registeredUser, function (err) {
            if (err) {
                console.error('Error during login after registration:', err);
                next(err);
            }
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        });
    } catch (err) {
        console.error('Error during user registration:', err);
        req.flash('error', err.message);
        res.redirect('/signup');
    }
}));
router.get('/login', (req, res) => {
    res.render('users/login');
});
router.post('/login', saveRedirectUrl, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), async (req, res) => {
    req.flash('success', 'Welcome back! You have logged in successfully!');
    let redirectUrl = res.locals.redirectUrl || '/listings'; // Use the redirect URL from res.locals or default to /listings
    res.redirect(redirectUrl);
});
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error('Error during logout:', err);
            req.flash('error', 'An error occurred while logging out. Please try again.');
            // return res.redirect('/listings');
            return next(err);
        }
        req.flash('success', 'You have logged out successfully!');
        res.redirect('/listings');
    });
});
module.exports = router;



// Notes
// After login, Passport stores only the user ID in the session using serializeUser().
// On every request, deserializeUser() fetches the full user from the database.
// The user object is attached to req.user.
// req.isAuthenticated() checks whether req.user exists.
// If user exists → authenticated, else not authenticated.