const Post = require("../models/Post");
const { postValidation } = require("../validations/postValidation");

const getHomePage = async (req, res) => {
  try {
    const locals = {
      title: " Blog",
      description: "Simple blog created with nodejs",
    };
    let perPage = 5;
    let page = req.query.page || 1;
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const getAboutPage = (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
};
const getContactPage = (req, res) => {
  res.render("contact", {
    currentRoute: "/contact",
  });
};

const getPostById = async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const searchPosts = async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
      currentRoute: "/",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
const dashboardPage = async (req, res) => {
  try {
    const data = await Post.find();
    res.render("admin/dashboard", { layout: "../views/layouts/admin", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPost = async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
      errorMessage: error.details[0].message,
    };
    return res.render("admin/add-post", {
      locals,
      layout: "../views/layouts/admin",
    });
  }

  const newPost = new Post({ title: req.body.title, body: req.body.body });

  try {
    await newPost.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewEditPost = async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: "../views/layouts/admin",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const editPost = async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getHomePage,
  getAboutPage,
  getPostById,
  searchPosts,
  getContactPage,
  dashboardPage,
  createPost,
  editPost,
  deletePost,
  viewEditPost,
};
