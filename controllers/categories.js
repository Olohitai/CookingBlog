const Category = require("../models/category");
const Recipe = require("../models/recipe");

exports.exploreCategories = async (req, res) => {
  const limitNumber = 20;
  const categories = await Category.find({}).limit(limitNumber);
  res.render("categories/categoriess", {
    title: "Cooking Blog - Categoreis",
    categories,
  });
};

exports.exploreCategoriesById = async (req, res) => {
  let categoryId = req.params.id;

  const limitNumber = 10;
  const categoryById = await Recipe.find({ category: categoryId }).limit(
    limitNumber
  );
  console.log(categoryById);
  res.render("categories/categoriess", {
    title: "Cooking Blog - Categoreis",
    categoryById,
  });
};
