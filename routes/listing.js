const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const listing = require('../models/listing.js');
//middleware
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js")

// Index route(list all the listings)  Read route
router.get('/', async (req, res) => {
    try {
        const allListings = await listing.find();
        // console.log('Fetched listings:', allListings);
        res.render('listings/index', { allListings });
    } catch (err) {
        console.error('Error fetching listings: from /listings', err);
        res.status(500).json({ error: 'Internal Server Error from /listings' });
    }
});
// new route
router.get('/new',isLoggedIn, async (req, res) => {
    console.log(req.user)
    console.log('Accessing /listings/new route');
    // if (!req.isAuthenticated()) {
    //     req.flash('error', 'You must be signed in to create a listing!');
    //     return res.redirect('/login');
    // }    
    res.render('listings/new');
})
// Create route
router.post('/', validateListing,isLoggedIn, wrapAsync(async (req, res, next) => {
    //When we make req from hopscotch without giving any data
    // if ( !req.body.listing) {
    //     throw new ExpressError("Send valid data for listing", 400);
    // }

    const newListing = new listing(req.body.listing)
    console.log('New listing data:', req.body);
    //if we make post fro hopscotch give only listing[title]Then we need to makesure everything is needed
    //(npm i joi) is the most powerful schema description language and data validator for JavaScript.
    // if (!newListing.title) {
    //     throw new ExpressError('Plz send title in Form body',400)
    // }
    // if (!newListing.description) {
    //     throw new ExpressError('Plz send description in Form body',400)
    // }
    // if (!newListing.location) {
    //     throw new ExpressError('Plz send location in Form body',400)
    // }
    console.log('Current user:', req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
}));

//show route
router.get('/:id', wrapAsync(async (req, res) => {

    const { id } = req.params;
    const foundListing = await listing.findById(id)
    .populate({
            path: 'reviews',
        populate: {
            path: 'author'
        }// populate author of review to show username in review card
    })
    .populate("owner");
    if (!foundListing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    // console.log('Found listing:', foundListing);
    // console.log("login: ", req.user);
    res.render('listings/show', { foundListing });
}));
// Edit Route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const edited = await listing.findById(req.params.id);
    if (!edited) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { edited });
}));
// Update Route
router.put('/:id',isLoggedIn, isOwner,validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError("Send valid data for listing", 400);
    }
    const { id } = req.params;
    
    await listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { returnDocument: "after", runValidators: true }
    );
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings`);

}));
// Delete Route
router.delete('/:id',isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted the listing!');
    res.redirect('/listings');
}));
module.exports = router;