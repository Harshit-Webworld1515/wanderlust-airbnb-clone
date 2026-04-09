const listing = require('./models/listing');
const { listingSchema,reviewSchema } = require("./schema.js") //joi Package
const ExpressError = require("./utils/ExpressError.js");


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
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listed = await listing.findById(id);
    if (!listed.owner.equals(res.locals.currentUser._id)) {
        req.flash(`error`, `You haven't aothority to make change that listing!`);
        return res.redirect(`/listings/${id}`);
    }
    next();
}
//joi package used for server validation remove if-else Statement
 module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(error, 400)
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(errMsg, 400)
    } else {
        next();
    }
}