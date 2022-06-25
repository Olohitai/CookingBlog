//Middleware are functions that run at ome point during a req, res cycle middleware must have a req,res,next

//Middleware to check if a user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  //passport automatically comes with an isAuthenticated method in the request object
  if (!req.isAuthenticated()) {
    //if not store the url they are requesting in the session

    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

//Note to get access to current user passoport gives the user method in the req object so
// basically req.user() gives the id, username, email and whatever necessary
//it is filled with the deserialized information from the session you know session stores the serialzed user and
//passport is going to deserialize it and fill request.user(res.user)with that data

const { recipeSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utilities/ExpressError");
const Recipe = require("./models/recipe");

//Middleware to Validate recipe
// module.exports.validateRecipe = (req, res, next) => {
//   const { error } = recipeSchema.validate(req.body);

//   if (error) {
//     const msg = error.details.map((el) => el.message).join(",");

//     throw new ExpressError(`${error.name}: ${msg}`, 400);
//   } else next();
// };

//Middleware to check for permission to perform tasks like delete, edit etc
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  if (!recipe.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/recipes/${id}`);
  }
  next();
};

const Review = require("./models/review");
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/recipes/${id}`);
  }
  next();
};

//Middleware to Validate reviews
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    console.log(error.details);
    throw new ExpressError(`${error.name}: ${msg}`, 400);
  } else next();
};
