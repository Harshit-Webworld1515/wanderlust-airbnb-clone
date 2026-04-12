const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require('../middleware.js');

const userControllers = require('../controllers/users.js');

router.get('/signup', userControllers.renderSignupForm);
router.post('/signup', wrapAsync(userControllers.signup));
router.get('/login', userControllers.renderLoginForm);
router.post('/login', saveRedirectUrl, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}),userControllers.login);
router.get('/logout',userControllers.logout);
module.exports = router;



// Notes
// After login, Passport stores only the user ID in the session using serializeUser().
// On every request, deserializeUser() fetches the full user from the database.
// The user object is attached to req.user.
// req.isAuthenticated() checks whether req.user exists.
// If user exists → authenticated, else not authenticated.