const mongoose = require('mongoose');
const listing = require('../models/listing');   
const initdata=require('./data.js');


async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
    console.log('Connected to MongoDB');
}   
main().then(() => {
    console.log('Database connection successful');
}).catch(err => {
    console.error('Database connection error:', err);
});
const initdb = async () => {
    try {
        await listing.deleteMany({});
        console.log('Existing listings cleared');
        initdata.data=initdata.data.map((obj)=>
            ({...obj,owner:"69d3f0c66e84613a5cd6910d"}
        ));
        await listing.insertMany(initdata.data);
        console.log('Database initialized with sample data');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};
initdb();