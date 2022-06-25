const { default: mongoose } = require("mongoose");
const cities = require("./cities");

const { places, descriptors } = require("./seedHelpers");
const { categories } = require("./categories");
const Recipe = require("../models/recipe");
const Category = require("../models/category");
const Review = require("../models/review");

mongoose
  .connect("mongodb://localhost:27017/cooking-blog")
  .then(console.log("Database Connected"))
  .catch((error) => console.error.bind(error, "connection error"));
mongoose.connection.on("error", (err) => {
  console.error("connection error", err);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
// const seedImg = async () => {
//   try {
//     const resp = await axios.get("https://api.unsplash.com/photos/random", {
//       params: {
//         client_id: "bdcFfCWjkDMpoo9W5qFweZ6hCn-Vnsql30P42ybf77E",
//         collections: 20431456,
//       },
//     });
//     return resp.data.urls.small;
//   } catch (err) {
//     console.error(err);
//   }
// };
const seedDB = async () => {
  await Category.deleteMany({});
  await Review.deleteMany({});
  await Category.insertMany([
    {
      name: "Thai",
      images: {
        url: "https://res.cloudinary.com/dtc7btsqu/image/upload/v1654755089/CookingBlog/xobnkud5dgkyutrhzmiu.jpg",
        filename: "CookingBlog/xobnkud5dgkyutrhzmiu.jpg",
      },
    },
    {
      name: "American",
      images: {
        url: "https://res.cloudinary.com/dtc7btsqu/image/upload/v1654752937/CookingBlog/yk9pvhfnqqqyljecadds.jpg",
        filename: "CookingBlog/yk9pvhfnqqqyljecadds.jpg",
      },
    },
    {
      name: "Chinese",
      images: {
        url: "https://res.cloudinary.com/dtc7btsqu/image/upload/v1654752937/CookingBlog/xccsyzo5vdwoudrtwehv.jpg",
        filename: "CookingBlog/xccsyzo5vdwoudrtwehv.jpg",
      },
    },
    {
      name: "Mexican",
      images: {
        url: "https://res.cloudinary.com/dtc7btsqu/image/upload/v1654752937/CookingBlog/q2se1mogfghpohisw0bi.jpg",
        filename: "CookingBlog/q2se1mogfghpohisw0bi.jpg",
      },
    },
    {
      name: "Indian",
      images: {
        url: "https://res.cloudinary.com/dtc7btsqu/image/upload/v1654752936/CookingBlog/nvpkac5cx4knq4zqhzan.jpg",
        filename: "CookingBlog/nvpkac5cx4knq4zqhzan.jpg",
      },
    },
    {
      name: "Spanish",
      images: {
        url: "https://res.cloudinary.com/dtc7btsqu/image/upload/v1654752937/CookingBlog/q2se1mogfghpohisw0bi.jpg",
        filename: "CookingBlog/q2se1mogfghpohisw0bi.jpg",
      },
    },
  ]);
  await Recipe.deleteMany({});
  for (i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);

    descriptors[Math.floor(Math.random) * descriptors.length];
    const recipe = new Recipe({
      author: "62b2f81d9d92aa9e73b4d8cc",
      category: `${sample(categories)}`,
      email: "olohitaipeace@gamil",
      name: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dtc7btsqu/image/upload/v1654752936/CookingBlog/nvpkac5cx4knq4zqhzan.jpg",
          filename: "CookingBlog/nvpkac5cx4knq4zqhzan.jpg",
        },
        {
          url: "https://res.cloudinary.com/dtc7btsqu/image/upload/v1654752937/CookingBlog/xccsyzo5vdwoudrtwehv.jpg",
          filename: "CookingBlog/xccsyzo5vdwoudrtwehv.jpg",
        },
        {
          url: "https://res.cloudinary.com/dtc7btsqu/image/upload/v1654752937/CookingBlog/q2se1mogfghpohisw0bi.jpg",
          filename: "CookingBlog/q2se1mogfghpohisw0bi.jpg",
        },
      ],
      ingredients: [
        "1 pounds ground beef",
        "1(30 ounce) jar marinara sauce",
        " ¾ cup water",
        "1 teaspon salt",
        "12 lasagna noodles",
        "12 ounces grated mozzarella cheese",
        "½ cup grated Parmesan cheese",
      ],

      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore, rem temporibus doloremque enim dolor sunt velit sit necessitatibus praesentium provident, culpa perspiciatis magnam, repellat voluptatum. Dolorum qui magni deleniti reprehenderit?",
    });

    await recipe.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
