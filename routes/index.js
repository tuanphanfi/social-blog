var express = require("express");
var router = express.Router();

//userAPI
const userAPI = require("./userApi");
router.use("/users", userAPI);

//authAPI
const authAPI = require("./authApi");
router.use("/auth", authAPI);

//blogAPI
const blogAPI = require("./blogApi");
router.use("/blogs", blogAPI);

//blogAPI
const reviewAPI = require("./reviewApi");
router.use("/reviews", reviewAPI);

//reactionAPI
const reactionAPI = require("./reactionApi");
router.use("/reactions", reactionAPI);

//friendshipAPI
const friendshipAPI = require("./friendshipAPI");
router.use("/friendship", friendshipAPI);


module.exports = router;
