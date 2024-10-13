const express = require("express");
const router = express.Router();
const {
  getHomePage,
  getAboutPage,
  getPostById,
  searchPosts,
  getContactPage,
} = require("../../controllers/postController");
const { searchPostValidation } = require("../../validations/postValidation");
const validationMiddleware = require("../../middleware/validationMiddleware");

/*
 * GET /
 * Home page
 */
router.get("/", getHomePage);

/**
 * GET /about
 * About page
 */
router.get("/about", getAboutPage);
router.get("/contact", getContactPage);

/**
 * GET /post/:id
 * Single post by ID
 */
router.get("/post/:id", getPostById);

/**
 * POST /search
 * Search posts with validation
 */
router.post("/search", validationMiddleware(searchPostValidation), searchPosts);

module.exports = router;
