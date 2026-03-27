const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const listing = require('./models/listing');
//Jo naam tum require me dete ho → wahi naam se tum Mongo operations karoge
const path = require('path');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js") //joi Package
const Review = require('./models/review.js')

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
const methodOverride = require("method-override");
const Listing = require('./models/listing');
app.use(methodOverride("_method"));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
    console.log('Connected to MongoDB');
}
main().then(() => {
    console.log('Database connection successful');
}).catch(err => {
    console.error('Database connection error:', err);
});
// Root route
app.get('/', async (req, res) => {
    let listings = await listing.find();
    res.send(listings);
});
//joi package used for server validation remove if-else Statement
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(error, 400)
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(errMsg, 400)
    } else {
        next();
    }
}
// Index route(list all the listings)  Read route
app.get('/listings', async (req, res) => {
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
app.get('/listings/new', async (req, res) => {
    res.render('listings/new');
})
// Create route
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
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

    await newListing.save();
    res.redirect('/listings');
}));

//show route
app.get('/listings/:id', wrapAsync(async (req, res) => {

    const { id } = req.params;
    const foundListing = await listing.findById(id);
    res.render('listings/show', { foundListing });
}));
// Edit Route
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const edited = await listing.findById(req.params.id);
    res.render('listings/edit', { edited });
}));
// Update Route
app.put('/listings/:id', wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError("Send valid data for listing", 400);
    }
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, ...req.body.listing, { returnDocument: "after", runValidators: true });
    res.redirect(`/listings`);

}));
// Delete Route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

//Reviews
app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params
    let revListing = await listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    revListing.reviews.push(newreview);
    await newreview.save();
    await revListing.save();
    console.log("new Review saved")
    res.redirect(`/listings/${id}`)
}
));
app.use((req, res, next) => {
    next(new ExpressError("This page isn't exist on this Route", 404));
});
//Error handling Middleware
app.use((err, req, res, next) => {
    const { status = 500, message } = err;
    console.log(err.stack);
    res.status(status).render('listings/error', { err })
    // res.status(status).send(err.message);
})
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});