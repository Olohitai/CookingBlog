const Review = require("../models/review");
const Recipe = require("../models/recipe.js");

module.exports.createReview = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  recipe.reviews.push(review);
  review.recipe = req.params.id;
  await review.save();

  await recipe.save();
  req.flash("success", "Created new review");
  res.redirect(`/recipes/${recipe._id}`);
};

module.exports.deleteReview = async (req, res) => {
  // res.send(req.params);
  const { id, reviewId } = req.params;
  const recipe = await Recipe.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Deleted review");
  res.redirect(`/recipes/${recipe._id}`);
};
