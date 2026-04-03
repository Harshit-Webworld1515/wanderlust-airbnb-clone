const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('./models/listing');
//Jo naam tum require me dete ho → wahi naam se tum Mongo operations karoge
const path = require('path');
// layout + partials support for ejs 
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js")
//session and flash
const session = require("express-session");
const flash = require("connect-flash");


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

// session middleware and flash middleware
const sessionOption = {
    secret: "mysupersecretkey",   // encryption key
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // for security
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
}
app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    console.log("Flash message set in res.locals:", res.locals.success);
    res.locals.error = req.flash("error");
    next();
});

const listings = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
    console.log('Connected to MongoDB');
}
main().then(() => {
    console.log('Database connection successful');
}).catch(err => {
    console.error('Database connection error:', err);
});

app.use("/listings/:id/reviews", reviewRoutes);
app.use("/listings", listings);

// Root route
app.get('/', async (req, res) => {
    let listings = await listing.find();
    res.send(listings);
});

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