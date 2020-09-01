var express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");
const { validate } = require("../middlewares/validators");

/**
 * @route GET api/reviews/blogs?page=1&limit=10
 * @description Get blogs with pagination
 * @access Public
 */
router.get(
  "/blogs/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectedID),
  ]),
  reviewController.getReviewsOfBlog
);

/**
 * @route POST api/reviews/blog/:id
 * @description Create a new review for a blog
 * @access Login required
 */

router.post(
  "/blogs/:id",
  authMiddleware.loginRequired,

  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectedID),
    body("content", "Missing content").exists().notEmpty(),
  ]),
  reviewController.createNewReview
);

/**
 * @route PUT api/reviews/:id
 * @description // UPDATE A REVIEW
 * @access Login required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,

  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectedID),
    body("content", "Missing content").exists().notEmpty(),
  ]),
  reviewController.updateSingleReview
);

/**
 * @route DELETE api/reviews/:id
 * @description // DELETE A REview
 * @access LOGIN required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectedID),
  ]),
  reviewController.deleteSingleReview
);

module.exports = router;