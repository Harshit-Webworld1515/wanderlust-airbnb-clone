const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const listing = require('../models/listing.js');
//middleware
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js")
const listingController = require('../controllers/listing.js');
//multipart form data handling for file uploads using multer
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

//router.route() is used to chain multiple route handlers for a specific path. 
router.route('/')
    //index route(list all the listings)  Read route
    .get(listingController.index)
    // Create route
    .post(isLoggedIn, validateListing,
        upload.single('listing[image][url]'),
         wrapAsync(listingController.createListing));
    // .post((req, res) => {
    //     res.send(req.file);}); // This will return the uploaded file information
    

    // new route
    router.get('/new',isLoggedIn,listingController.renderNewForm )
    // Edit Route
    router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
    
    router.route('/:id')
    //show route
    .get(wrapAsync(listingController.showListing))
    //update route
    .put(isLoggedIn, isOwner,
        validateListing,upload.single('listing[image][url]'),
         wrapAsync(listingController.updateListing))
    //delete route
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
    module.exports = router;
    
    
    // Index route(list all the listings)  Read route
    // router.get('/', listingController.index);
    // Create route
    // router.post('/', isLoggedIn,validateListing, wrapAsync(listingController.createListing));
    
    //show route
    // router.get('/:id', wrapAsync(listingController.showListing));
    // Update Route
    // router.put('/:id',isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListing));
    // Delete Route
    // router.delete('/:id',isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
    
    