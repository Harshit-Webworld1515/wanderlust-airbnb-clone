const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js") //joi Package
const Review = require('../models/review.js')
const listing = require('../models/listing.js');


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


//Post Reviews Route
router.post('/', validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params
    console.log(id);
    let revListing = await listing.findById(id);
    let newreview = new Review(req.body.review);
    revListing.reviews.push(newreview);
    await newreview.save();
    await revListing.save();
    console.log("new Review saved");
    res.redirect(`/listings/${id}`);
}
));
//Delete Review Route
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    // 1. Review collection se delete
    await Review.findByIdAndDelete(reviewId);
    await listing.updateOne({ _id: id },
        { $pull: { reviews: reviewId } }
    );
    res.redirect(`/listings/${id}`);

}
))
module.exports = router;