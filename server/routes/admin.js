const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const authController = require("../../controllers/authController");
const postController = require("../../controllers/postController");

// Authentication routes
router.get("/register", (req, res) =>
  res.render("admin/register", { layout: "../views/layouts/admin" }),
);
router.post("/register", authController.registerUser);
router.get("/admin", (req, res) =>
  res.render("admin/index", { layout: "../views/layouts/admin" }),
);
router.post("/admin", authController.loginUser);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Admin dashboard and post routes
router.get("/dashboard", authMiddleware, postController.dashboardPage);
router.get("/add-post", authMiddleware, (req, res) =>
  res.render("admin/add-post", { layout: "../views/layouts/admin" }),
);
router.post("/add-post", authMiddleware, postController.createPost);

router.get("/edit-post/:id", authMiddleware, postController.viewEditPost);
router.put("/edit-post/:id", authMiddleware, postController.editPost);
router.delete("/delete-post/:id", authMiddleware, postController.deletePost);

module.exports = router;
