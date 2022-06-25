const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const { cloudinary } = require("../cloudinary");
//Instead of doing RecipeSchema = new mongoose.Schema we assigned Schema to be mongoose.Schema
// Lost ? watch the colt video section 54 lesson 544
// const ImageSchema = {
//   url: String,
//   filename: String,
// };
// ImageSchema.virtual("thumbnail").get(function () {
//   return this.url.replace("/upload", "/upload/w_200");
// });

// const ImageSchema = new Schema({
//   url: String,
//   filename: String,
// });

// ImageSchema.virtual("thumbnail").get(function () {
//   return this.url.replace("/upload", "/upload/w_100");
// });
const opts = { toJSON: { virtuals: true } };
const RecipeSchema = new Schema(
  {
    email: String,
    name: String,
    images: [{ url: String, filename: String }],

    direction: String,

    ingredients: Array,
    category: {
      type: String,
      enum: [
        "Appetizers and snacks",
        "Breakfast and Brunch Recipe",
        "Cookies",
        "Soups, Stews Recipe",
        "Dessert",
        "Chicken Recipes",
        "BBQ & Grilling",
      ],
    },
    description: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  opts
);

RecipeSchema.path("images")
  .schema.virtual("thumbnail")
  .get(function () {
    return this.url.replace("/upload/", "/upload/w_200,h_200/");
  });

RecipeSchema.post("findOneAndDelete", async function (doc) {
  console.log(doc);
  if (doc) {
    await Review.deleteMany({
      //deleting many based of on _id in doc.reviews
      _id: {
        $in: doc.reviews,
      },
    });
    for (const img of doc.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});

RecipeSchema.plugin(mongoosePaginate);
// This middleware is only triggered when we delete a recipe with the recipe.findByIdAndDelete(id) in  app.js ;
// doc is basically an object contaning the body of the recipe being deleted
// like the _id, name, reviews[_id, body,rating],....
// console.log(doc);
// we are checking if anything is being deleted if yes we want to bulk delete the review associated with  that recipe by
// checking if the _id) is in doc.reviews
module.exports = mongoose.model("Recipe", RecipeSchema);
