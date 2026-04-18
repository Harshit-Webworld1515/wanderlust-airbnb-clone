const mongoose = require('mongoose');
const Review =require('./review.js');
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
   }],
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   category: {
      type: String,
      enum: ['Beach', 'Mountain', 'City', 'Countryside', 'Adventure', 'Cultural', 'Family', 'Romantic', 'Wildlife', 'Historical'],
      required: true
   }
});
// Mongoose middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async(listing) =>{
if (listing) {
await Review.deleteMany({ _id: { $in: listing.reviews } }) ;
}
})
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;   


// Notes
// 1. Mongoose middleware is used to perform actions before or after
//  certain events occur in the lifecycle of a Mongoose document. In
//  this case, we are using a post middleware that triggers after a 
// listing is deleted. It checks if the listing exists and then deletes
//  all reviews associated with that listing using the Review model's 
// deleteMany method.
// 2. The set function in the image.url field ensures that if an empty
//  string is provided for the URL, it defaults to a specified image 
// URL. This prevents the image field from being empty and ensures that
//  there is always a valid image URL associated with the listing.
// 3. The reviews field in the listing schema is an array of ObjectIds
//  that reference the Review model. This allows us to establish a 
// relationship between listings and their associated reviews, enabling
//  us to easily retrieve and manage reviews for each listing.
// 4. By using Mongoose middleware to handle the deletion of associated
//  reviews, we ensure that our database remains consistent and that there
//  are no orphaned review documents left behind when a listing is deleted.
// 5. This approach helps maintain data integrity and ensures that our
//  application behaves predictably when listings are removed, providing a
// better user experience and preventing potential issues with dangling 
// references
// syntax -
// schema.post("operation", function (doc) {
//     // code after operation
// });