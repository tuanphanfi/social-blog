var express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");
const { validate } = require("../middlewares/validators");

/**
 * @route POST api/blogs?page=1&limit=10
 * @description Get blogs with pagination
 * @access Public
 */
router.get("/", authMiddleware.loginRequired, blogController.getBlogs);

/**
 * @route POST api/blogs?page=1&limit=10
 * @description Get blogs with pagination
 * @access Public
 */
router.get(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectedID),
  ]),
  blogController.getSingleBlog
);

/**
 * @route POST api/blogs?page=1&limit=10
 * @description // CREATE A BLOG
 * @access Public
 */

router.post(
  "/create",
  authMiddleware.loginRequired,
  blogController.createABlog,
  validators.validate([
    body("title", "Missing title").exists().notEmpty(),
    body("content", "Missing content").exists().notEmpty(),
  ])
);

/**
 * @route PUT api/blogs/:id
 * @description // UPDATE A BLOG
 * @access Public
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,

  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectedID),
    body("title", "Missing title").exists().notEmpty(),
    body("content", "Missing content").exists().notEmpty(),
  ]),
  blogController.updateABlog
);

/**
 * @route DELETE api/blogs/:id
 * @description // DELETE A BLOG
 * @access LOGIN required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectedID),
  ]),
  blogController.deleteABlog
);

module.exports = router;
