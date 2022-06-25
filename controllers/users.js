const User = require("../models/user");
const Recipe = require("../models/recipe");
const Review = require("../models/review");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password, firstname, lastname, avatar } = req.body;
    const user = new User({ email, username, firstname, lastname, avatar });
    const registeredUser = await User.register(user, password);
    req.logIn(registeredUser, (err) => {
      if (err) return next(err);
      else {
        req.flash("success", "Welcome to YelpCamp");
        res.redirect("/recipes");
      }
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUsers = (req, res) => {
  req.flash("success", "Welcome Back!");
  //Look for what req.session.returnTo is ..see middleware.js and
  // app.use(the one with res.local) in app.js
  const redirectUrl = req.session.returnTo;

  // console.log(req.session);
  //DELETE THE SESSION AFTERWARDS
  delete req.session.returnTo;
  //When I am about to login that middleware(app.use in app.js) will check if in the login route  or the / route there is orignalUrl if not it will add it
  // then the moment I login  this one here redirects me to whatever that url was
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res) => {
  //logOut is a method added to our request object via passport
  req.logOut();
  req.flash("success", "Goodbye");
  res.redirect("/recipes");
};

//--------USER PROFILE----------//

module.exports.profilePage = async (req, res) => {
  const { id } = req.params;
  const limitNumber = 5;
  const user = await User.findById(id);
  await Recipe.find({})
    .where("author")
    .equals(user._id)
    .sort({ _id: -1 })
    .limit(limitNumber)
    .exec((err, recipes) => {
      if (err) {
        req.flash("error", "something went wrong ):");
      }

      return res.render("users/show", { user, recipes });
    });
};

module.exports.userReviews = async (req, res) => {
  const { id } = req.params;
  const limitNumber = 5;
  const user = await User.findById(id);
  Review.find({})
    .where("author")
    .equals(user._id)
    .populate("recipe")
    .sort({ _id: -1 })
    .limit(limitNumber)
    .exec((err, reviews) => {
      if (err) {
        req.flash("error", "something went wrong ):");
      }

      return res.render("users/show", { user, reviews });
    });
};
