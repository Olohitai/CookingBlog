const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");

const recipes = require("../controllers/recipes");
const { isLoggedIn, validateRecipe, isAuthor } = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  //Displays all recipes
  .get(catchAsync(recipes.index))
  //Creates new Recipe on server
  .post(
    isLoggedIn,
    upload.array("image"),
    // validateRecipe,
    catchAsync(recipes.createRecipe)
  );

// .post(upload.single("image"), (req, res) => {
//   res.send("It worked");
//   console.log(req.body, req.file);
// });
// router.post("/:id/like", isLoggedIn, catchAsync(recipes.likeRecipe));
//Form to Create new Recipe
router.get("/new", isLoggedIn, recipes.renderNewForm);

router
  .route("/:id")
  //Show Details of one Recipe
  .get(catchAsync(recipes.showRecipe))
  //Update a particular Recipe
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    // validateRecipe,
    catchAsync(recipes.updateRecipe)
  )
  //Delete a particular Recipe
  .delete(isLoggedIn, isAuthor, catchAsync(recipes.deleteRecipe));
//Form to edit specfic Recipe
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(recipes.editRecipe));

router.post("/:id/like", isLoggedIn, catchAsync(recipes.like));

module.exports = router;
