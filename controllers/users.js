const User = require('../models/user.js');

module.exports.renderSignupForm=(req, res) => {
    res.render('users/signup');
};
module.exports.signup = (async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log("Registered user:", registeredUser);
        // Automatically log in the user after successful registration
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
})
module.exports.renderLoginForm=(req, res) => {
    res.render('users/login');
}
module.exports.login= async (req, res) => {
    req.flash('success', 'Welcome back! You have logged in successfully!');
    let redirectUrl = res.locals.redirectUrl || '/listings'; // Use the redirect URL from res.locals or default to /listings
    res.redirect(redirectUrl);
}
module.exports.logout= (req, res) => {
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
}