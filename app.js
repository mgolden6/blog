//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien.";

const app = express();

let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postTitle", function (req, res) {
  posts.forEach(function (post) {
    if (_.lowerCase(req.params.postTitle) === _.lowerCase(post.title)) {
      res.render("post", {
        postTitle: post.title,
        postBody: post.body
      });
    }
  });
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.NAMEinputTitle,
    body: req.body.NAMEinputBody
  };
  posts.push(post);
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});