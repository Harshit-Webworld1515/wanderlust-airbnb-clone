const listing = require('../models/listing');
const Review = require('../models/review.js');

module.exports.createReview = (async (req, res) => {
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
)
module.exports.destroyReview =(async (req, res) => {
    let { id, reviewId } = req.params;
    // 1. Review collection se delete
    await Review.findByIdAndDelete(reviewId);
    await listing.updateOne({ _id: id },
        { $pull: { reviews: reviewId } }
    );
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/listings/${id}`);

}
)