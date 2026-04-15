const listing = require('../models/listing');


module.exports.index=async (req, res) => {
    try {
        const allListings = await listing.find();
        // console.log('Fetched listings:', allListings);
        res.render('listings/index', { allListings });
    } catch (err) {
        console.error('Error fetching listings: from /listings', err);
        res.status(500).json({ error: 'Internal Server Error from /listings' });
    }
}
module.exports.renderNewForm=async (req, res) => {
    console.log(req.user)//logged in user details
    console.log('Accessing /listings/new route');
    // if (!req.isAuthenticated()) {
    //     req.flash('error', 'You must be signed in to create a listing!');
    //     return res.redirect('/login');
    // }    
    res.render('listings/new');
}
module.exports.showListing=(async (req, res) => {

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
});
module.exports.createListing=(async (req, res, next) => {
    //When we make req from hopscotch without giving any data
    // if ( !req.body.listing) {
    //     throw new ExpressError("Send valid data for listing", 400);
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    req.body.listing.image={url,filename};
    

    console.log('File upload details:', { url, filename });
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
})
module.exports.renderEditForm=(async (req, res) => {
    const edited = await listing.findById(req.params.id);
    if (!edited) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { edited });
})
module.exports.updateListing=(async (req, res) => {
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
    res.redirect(`/listings/${id}`);

})
module.exports.destroyListing=(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted the listing!');
    res.redirect('/listings');
})