var express = require("express");
var router = express.Router();

//userAPI
const userAPI = require("./userAPI");
router.use("/users", userAPI);

//authAPI
const authAPI = require("./authAPI");
router.use("/auth", authAPI);

//blogAPI
const blogAPI = require("./blogAPI");
router.use("/blogs", blogAPI);

//blogAPI
const reviewAPI = require("./reviewAPI");
router.use("/reviews", reviewAPI);

//reactionAPI
const reactionAPI = require("./reactionAPI");
router.use("/reactions", reactionAPI);

//friendshipAPI
const friendshipAPI = require("./friendshipAPI");
router.use("/friendship", friendshipAPI);


module.exports = router;
