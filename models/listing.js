const mongoose = require('mongoose');
const listingSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   description: String,
   price: Number,
   location: String,
   image: {
      filename: {
         type: String,
         default: "listing.jpg",
      },
      url: {
         type: String,
         default: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
         set: (value) => value === ""
            ? "https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
            : value,
      }
   },
   country: String,
   reviews:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
   }]
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;   
