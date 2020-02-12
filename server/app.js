/**
 * If in development, import the local environment
 * configuration file.
 */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const digest = require("./digest");
const auth = require("./auth");
const users = require("./user-agent");
const methodOverride = require("method-override");
const PORT = process.env.PORT || 8000;
const usersRoute = require("./routes/users");

const initialisePassport = require("./passport-config");
initialisePassport(
  passport,
  email => users.findByEmail(email),
  id => users.findById(id)
);

// @temporary Set view engine (for demoing views)
app.set("view-engine", "ejs");

// -- app use -- //
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use("/users", usersRoute);

// Connect to DB
// TODO:

// -- GET REQUESTS -- //

// Render and direct to view based on user auth status
app.get("/", auth.checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", auth.checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/register", auth.checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

// -- POST REQUESTS -- //

app.post(
  "/login",
  auth.checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.post("/register", auth.checkNotAuthenticated, async (req, res) => {
  try {
    const secureSalt = digest.getSecureSaltInHex();
    const hashedPassword = digest.hashPassWithSaltInHex(
      req.body.password,
      secureSalt
    );
    users.pushNewUser(req, secureSalt, hashedPassword);
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
