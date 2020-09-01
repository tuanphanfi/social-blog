var express = require("express");
const router = express.Router();
const friendshipController = require("../controllers/friendshipController");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");

/**
 * @route SEND api/friends/add/:id
 * @description Get blogs with pagination
 * @access Public
 */

router.post(
  "/add/:id",
  authMiddleware.loginRequired,
  friendshipController.sendRequest
);

/**
 * @route ACCEPT api/
 * @description Get blogs with pagination
 * @access Public
 */

router.put(
  "/accept/:id",
  authMiddleware.loginRequired,
  friendshipController.acceptRequest
);

/**
 * @route DECLINE a REQUEST api/
 * @description Get blogs with pagination
 * @access Public
 */

router.put(
  "/decline/:id",
  authMiddleware.loginRequired,
  friendshipController.declineRequest
);

/**
 * @route CANCEL a REQUEST api/
 * @description Get blogs with pagination
 * @access Public
 */

router.delete(
  "/add:id",
  authMiddleware.loginRequired,
  friendshipController.declineRequest
);

/**
 * @route REMOVE a FRIEND api/
 * @description Get blogs with pagination
 * @access Public
 */

router.delete("/:id");

module.exports = router;
