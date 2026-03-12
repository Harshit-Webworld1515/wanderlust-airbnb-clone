const expess = require('express');
const app = expess();
const mongoose = require('mongoose');
const ejs = require('ejs');
const listing = require('./models/listing');
const path = require('path');
const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate); 
app.set('view engine', 'ejs');
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.set('views', path.join(__dirname, 'views'));
app.use(expess.urlencoded({ extended: true }));
app.use(expess.static(path.join(__dirname, '/public')));

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
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
// Index route(list all the listings)  Read route
app.get('/listings', async (req, res) => {
    try {
        const allListings = await listing.find();  
        // console.log('Fetched listings:', allListings);
        res.render('listings/index', { allListings });
    }catch (err){
        console.error('Error fetching listings: from /listings', err);
        res.status(500).json({ error: 'Internal Server Error from /listings' });
    }       
});
// new route
app.get('/listings/new',async(req,res)=>{
    res.render('listings/new');
})// Create route
app.post('/listings', async (req, res) => {
    try {
        const newListing = new listing(req.body);
        console.log('New listing data:', req.body);
        await newListing.save();
        res.redirect('/listings');
    } catch (err) {
        console.error('Error creating listing:', err);
        res.status(500).json({ error: 'Internal Server Error from POST /listings' });
    }
});

//show route
app.get('/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const foundListing = await listing.findById(id);
        res.render('listings/show', { foundListing });
    } catch (err) {
        console.error('Error fetching listing:', err);
        res.status(500).json({ error: 'Internal Server Error /listings/:id' });
    }
});
// Edit Route
app.get('/listings/:id/edit', async (req, res) => {
    try{
    const edited=await listing.findById(req.params.id);
    res.render('listings/edit',{edited});
    }
    catch(err){
        console.error('Error fetching listing for edit:', err);
        res.status(500).json({ error: 'Internal Server Error /listings/:id/edit' });
    }
});// Update Route
app.put('/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.redirect(`/listings`);
    } catch (err) {
        console.error('Error updating listing:', err);
        res.status(500).json({ error: 'Internal Server Error from PUT /listings/:id' });
    }   
});
// Delete Route
app.delete('/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await listing.findByIdAndDelete(id);
        res.redirect('/listings');
    } catch (err) {
        console.error('Error deleting listing:', err);
        res.status(500).json({ error: 'Internal Server Error from DELETE /listings/:id' });
    }
});
