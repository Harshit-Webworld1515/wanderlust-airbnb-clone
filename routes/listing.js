const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const listing = require('../models/listing.js');
//middleware
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js")
const listingController = require('../controllers/listing.js');

// Index route(list all the listings)  Read route
router.get('/', listingController.index);
// new route
router.get('/new',isLoggedIn,listingController.renderNewForm )
// Create route
router.post('/', isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//show route
router.get('/:id', wrapAsync(listingController.showListing));
// Edit Route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
// Update Route
router.put('/:id',isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListing));
// Delete Route
router.delete('/:id',isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;