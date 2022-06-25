const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");

const passport = require("passport");
const users = require("../controllers/users");

const authenticate = () => {
  return passport.authenticate("local", {
    //The failureFlash is what causes the flash when we have an error
    //This ispassport working together with flash
    failureFlash: true,
    failureRedirect: "/login",
  });
};
router
  .route("/register")
  //Form to register users
  .get(users.registerForm)
  //Registers users on server
  .post(catchAsync(users.registerUser));

router
  .route("/login")
  //form to login users
  .get(users.loginForm)
  //Login in users on server
  //authenticate is not a middleware its just a function thats why i had to call ie()
  //unlike validateCampground and ValidateReview
  .post(authenticate(), users.loginUsers);

//Logout users
router.get("/logout", users.logOut);

// USER PROFILE
router.get("/users/:id", catchAsync(users.profilePage));
router.get("/users/:id/reviews", catchAsync(users.userReviews));

module.exports = router;
