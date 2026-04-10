const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Review = require('../models/review.js')
const listing = require('../models/listing.js');
//middleware
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js")



//Post Reviews Route
router.post('/', validateReview,isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params
    console.log(id);
    let revListing = await listing.findById(id);
    let newreview = new Review(req.body.review);
    newreview.author=req.user._id;
    console.log(newreview);
    revListing.reviews.push(newreview);
    await newreview.save();
    await revListing.save();
    console.log("new Review saved");
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/listings/${id}`);
}
));
//Delete Review Route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    // 1. Review collection se delete
    await Review.findByIdAndDelete(reviewId);
    await listing.updateOne({ _id: id },
        { $pull: { reviews: reviewId } }
    );
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/listings/${id}`);

}
))
module.exports = router;