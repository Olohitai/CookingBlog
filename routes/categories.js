const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");

const categories = require("../controllers/categories");

router.get("/categories", catchAsync(categories.exploreCategories));
router.get("/recipes/categories/:id", categories.exploreCategoriesById);

module.exports = router;
