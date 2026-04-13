const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require('../middleware.js');

const userControllers = require('../controllers/users.js');
//router.route() is used to chain multiple route handlers for a specific path.
router.route('/signup')
    // Render the signup form
    .get(userControllers.renderSignupForm)
    // Handle the signup form submission
    .post(wrapAsync(userControllers.signup));
router.route('/login')
    // Render the login form
    .get(userControllers.renderLoginForm)
    // Handle the login form submission
    .post(saveRedirectUrl, passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), userControllers.login);
    // Handle logout
router.route('/logout')
    .get(userControllers.logout);
module.exports = router;



// Notes
// After login, Passport stores only the user ID in the session using serializeUser().
// On every request, deserializeUser() fetches the full user from the database.
// The user object is attached to req.user.
// req.isAuthenticated() checks whether req.user exists.
// If user exists → authenticated, else not authenticated.