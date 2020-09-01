var express = require("express");
const router = express.Router();
const reactionController = require("../controllers/reactionController");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");

/**
 * @route GET api/reviews/blogs?page=1&limit=10
 * @description Get blogs with pagination
 * @access Public
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  validators.validate([
    body("targetType", "Missing targetType")
      .exists()
      .notEmpty()
      .isIn(["Blog", "Review"]),
  ]),
  reactionController.createAReaction
);

module.exports = router;
