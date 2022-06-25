const Recipe = require("../models/recipe");
const Category = require("../models/category");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  if (req.query.page && req.query.search) {
    const { page, search } = req.query;
    console.log(req.query);
    const regex = new RegExp(escapeRegex(search), "gi");
    const recipes = await Recipe.paginate(
      {
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
      },
      {
        page,
      }
    );

    console.log(recipes.docs.length);
    return res.status(200).json(recipes);
  }
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");

    const recipes = await Recipe.paginate({
      $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
    });

    return res.render("recipes/index", { recipes });
  }
  if (!req.query.page) {
    const recipes = await Recipe.paginate({});

    res.render("recipes/index", { recipes });
  } else {
    const { page } = req.query;
    const recipes = await Recipe.paginate(
      {},
      {
        page,
      }
    );
    return res.status(200).json(recipes);
  }
};

///////////////////////////////////////
exports.homepage = async (req, res) => {
  const limitNumber = 5;
  const categories = await Category.find({}).limit(limitNumber);
  const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
  const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
  const american = await Recipe.find({ category: "American" }).limit(
    limitNumber
  );
  const chinese = await Recipe.find({ category: "Chinese" }).limit(limitNumber);

  const food = { latest, thai, american, chinese };

  res.render("recipes/home", {
    title: "Cooking Blog - Home",
    categories,
    food,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("recipes/new");
};

module.exports.createRecipe = async (req, res, next) => {
  const recipe = new Recipe(req.body.recipe);
  console.log(req.body);
  recipe.images = req.files.map((f) => ({
    // req.files is from multer
    url: f.path,
    filename: f.filename,
  }));
  recipe.author = req.user._id;
  await recipe.save();
  req.flash("success", "Successfully made a new recipe!");
  res.redirect(`/recipes/${recipe._id}`);
};

module.exports.showRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("likes")
    .populate("author");
  if (!recipe) {
    req.flash("error", "Cannot find that recipe!");
    return res.redirect("/recipes");
  }
  res.render("recipes/show", { recipe });
};

module.exports.editRecipe = async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    req.flash("error", "Cannot find that recipe!");
    return res.redirect("/recipes");
  }
  res.render("recipes/edit", { recipe });
};

module.exports.updateRecipe = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const recipe = await Recipe.findByIdAndUpdate(id, {
    ...req.body.recipe,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  recipe.images.push(...imgs);
  await recipe.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await recipe.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated recipe!");
  res.redirect(`/recipes/${recipe._id}`);
};

module.exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  await Recipe.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted recipe");
  res.redirect("/recipes");
};

module.exports.likeRecipe = async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  if (recipe.likes.equals(req.user_id)) {
    recipe.likes.pull(req.user_id);
  } else {
    recipe.likes.push(req.user);
  }
  await recipe.save();
  res.redirect(`/recipes/${recipe._id}`);
};

module.exports.like = async (req, res) => {
  const { id } = req.params;
  const foundrecipe = await Recipe.findById(id);

  const foundUserlike = foundrecipe.likes.some((e) => e.equals(req.user._id));
  if (foundUserlike) {
    foundrecipe.likes.pull(req.user._id);
  } else {
    foundrecipe.likes.push(req.user);
  }
  await foundrecipe.save();

  res.redirect(`/recipes/${foundrecipe._id}`);
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
