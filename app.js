const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require("bcryptjs");
const db = require("./models");

const { sequelize, User, Post } = db;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const quotes = [
  ">> Welcome to the Cyber Zone <<",
  "Loading... █▒▒▒▒▒▒▒▒▒",
  "👾 Hack the Planet!",
  "¯\\_(ツ)_/¯ Blog Hard!",
  "[ RETRO BLOG ACTIVE ]",
  ">>> Insert Coin to Post <<<",
];

console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("CLIENT SECRET:", process.env.GOOGLE_CLIENT_SECRET);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

sequelize
  .authenticate()
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ Connection error:", err));

sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Tables synced"))
  .catch((err) => console.error("❌ Sync error:", err));

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ where: { username } });
    if (!user) return done(null, false, { message: "No user found" });
    const match = await bcrypt.compare(password, user.password);
    return match
      ? done(null, user)
      : done(null, false, { message: "Incorrect password" });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } });
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            googleId: profile.id,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

app.get("/", (req, res) => {
  res.render("start");
});

app.get("/landing", ensureAuthenticated, (req, res) => {
  res.render("landing");
});

app.post("/select-theme", ensureAuthenticated, (req, res) => {
  req.session.theme = req.body.theme;
  res.redirect("/home");
});

app.get("/home", ensureAuthenticated, async (req, res) => {
  const theme = req.query.theme || req.session.theme || "default";

  // Store selected theme in session
  if (req.query.theme) {
    req.session.theme = req.query.theme;
  }

  const posts = await Post.findAll({
    where: { UserId: req.user.id },
    order: [["createdAt", "DESC"]],
  });
  res.render("home", { posts, theme, user: req.user });
});

app.get("/compose", ensureAuthenticated, (req, res) => {
  const theme = req.session.theme || "default";
  res.render("compose", { theme, user: req.user });
});

app.post("/compose", ensureAuth, async (req, res) => {
  const { postTitle, postBody } = req.body;
  await Post.create({
    title: postTitle,
    content: postBody,
    UserId: req.user.id,
  });
  res.redirect("/home");
});

app.get("/edit/:id", ensureAuth, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("edit", { post, user: req.user });
});

app.post("/edit/:id", ensureAuth, async (req, res) => {
  const { postTitle, postBody } = req.body;
  await Post.update(
    { title: postTitle, content: postBody },
    { where: { id: req.params.id } }
  );
  res.redirect("/home");
});

app.post("/delete/:id", ensureAuth, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post || post.UserId !== req.user.id) {
    return res.status(403).send("Unauthorized");
  }

  await Post.destroy({ where: { id: req.params.id } });
  res.redirect("/home");
});

app.get("/register", (req, res) => {
  const theme = req.session.theme || "default";
  res.render("register", { theme });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  const theme = req.session.theme || "default";
  res.render("login", { theme });
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/landing");
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/landing");
  }
);

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.use((req, res, next) => {
  res.locals.theme = req.session.theme || "default";
  next();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
