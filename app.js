const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

// Content for different pages
const homeStartingContent = "...";
const aboutContent = "...";
const contactContent = "...";

// Connect to the MongoDB database
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the posts schema and model
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

// Set the view engine to EJS
app.set("view engine", "ejs");

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home route
app.get("/", async (req, res) => {
  // Retrieve all posts from the database
  const posts = await Post.find({});
  res.render("home", { startingContent: homeStartingContent, posts: posts });
});

// About route
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

// Contact route
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

// Compose route (render the compose form)
app.get("/compose", (req, res) => {
  res.render("compose");
});

// Compose route (handle form submission)
app.post("/compose", async (req, res) => {
  // Create a new post object with data from the form
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
  });

  // Save the post to the database
  await post.save();
  res.redirect("/");
});

// Individual post route
app.get("/posts/:_id", async (req, res) => {
  try {
    // Find the requested post by its ID
    const requestedPost = await Post.findOne({ _id: req.params._id });

    // Render the post template with the requested post data
    res.render("post", {
      title: requestedPost.title,
      body: requestedPost.body,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Oops, something went wrong.");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
