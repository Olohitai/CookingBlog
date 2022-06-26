if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");

const flash = require("connect-flash");
const ExpressError = require("./utilities/ExpressError");
const app = express();

const recipesRoutes = require("./routes/recipes");
const categoryRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const reviewsRoutes = require("./routes/reviews");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo");

const dburl = process.env.DB_URL || "mongodb://localhost:27017/cooking-blog";

//Connect to Monogoose

mongoose
  .connect(process.env.DB_URL)
  .then(console.log("Database Connected"))
  .catch((error) => console.error.bind(error, "connection error"));
// Error After Connection
mongoose.connection.on("error", (err) => {
  console.error("connection error", err);
});

//Tells Express that we want to use ejsMate to parse the data instead of the default
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(mongoSanitize());

const secret = process.env.SECRET || "mysecretsessions";
const store = MongoDBStore.create({
  mongoUrl: dburl,
  crypto: {
    secret,
  },
  touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
  store,
  name: "sessions",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    HttpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

//Serialize and Deserialize deals with how information is stored and recieved in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // check if  /login or / does not contain the req.orignalUrl
  // if true the set session.returnTO to be te url
  if (!["/login", "/"].includes(req.originalUrl)) {
    // console.log(req.session);
    req.session.returnTo = req.originalUrl;
  }

  if (req.session.returnTo.includes("/like")) {
    req.session.returnTo = req.session.returnTo.replace("/like", "/");
    console.log(req.session.returnTo);
  }
  res.locals.search = req.query.search;
  res.locals.signedUser = req.user; //Used in navbar.ejs to show and hide the login register and logout links
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/recipes", recipesRoutes);
app.use("/", categoryRoutes);
app.use("/", usersRoutes);
app.use("/recipes/:id/reviews", reviewsRoutes);

const Category = require("./models/category");
const Recipe = require("./models/recipe");

app.get("/", async (req, res) => {
  const limitNumber = 5;
  const categories = await Category.find({}).limit(limitNumber);

  const recipes = await Recipe.find({}).limit(10);
  const latest = await Recipe.find({}).populate("author").sort({ _id: -1 });

  res.render("home", {
    categories,
    latest,

    recipes,
  });
});

app.get("/contact", (req, res) => {
  res.render("contactUs");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  if (!err.message) err.message = "Something went wrong";
  const { statusCode = 404 } = err;
  res.status(statusCode).render("error", { err });
});
const port = process.env.PORT;
app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}`);
});
