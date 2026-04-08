module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    // console.log(req.path,",,",req.originalUrl); -->/new ,, /listings/new
    if (!req.isAuthenticated()) {
        //redirect url is the url that the user was trying to access before being redirected to login
        req.session.redirectUrl = req.originalUrl; // Store the original URL in the session 
        req.flash('error', 'You must be logged in to access this page!');
        return res.redirect('/login');
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available to the template
        // delete req.session.redirectUrl; // Clear the redirect URL from the session after using it
    }
    next();
}