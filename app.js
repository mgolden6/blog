//jshint esversion:6

//require and configure express
const express = require("express");
const port = 3000;
const app = express();

//enable use of local files
app.use(express.static("public"));

//enable and configure ejs
const ejs = require("ejs");
app.set("view engine", "ejs");

//require lodash
const _ = require("lodash");

//require and configure body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//setup db
//require mongoose
const mongoose = require("mongoose");

//create a mongodb, and connect mongoose to it
mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

//get the status of the mongoose connection to the db
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose connected!");
});

//build db schema(s)
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

//compile schema(s) into model(s) (model = class/collection to construct document(s)
const Post = mongoose.model("Post", postSchema);

//set starting content
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien.";

//render HOME page
app.get("/", function (req, res) {
  //find all posts
  Post.find({}, function (err, foundPosts) {
    //handle any errors when finding posts
    if (err) {
      console.log(err + " @ get /");
      //if no errors, display all posts
    } else {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: foundPosts
      });
    }
  });
});

//render ABOUT page
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

//render CONTACT page
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

//render COMPOSE page
app.get("/compose", function (req, res) {
  res.render("compose");
});

//render A SPECIFIC POST
app.get("/posts/:postTitle", function (req, res) {
  //find the specific post
  Post.findOne({ title: req.params.postTitle }, function (err, foundPost) {
    //handle any errors while looking for the post
    if (err) {
      console.log(err + " ERROR when finding a specific post");
    } else {
      res.render("post", {
        postTitle: foundPost.title,
        postContent: foundPost.content
      });
    }
  });
});

//capture a NEW POST
app.post("/compose", function (req, res) {
  const newPost = new Post({
    title: req.body.NAMEinputTitle,
    content: req.body.NAMEinputBody
  });
  newPost.save();
  res.redirect("/");
});

//setup the app to listen and test
app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server started on port 3000");
  }
});