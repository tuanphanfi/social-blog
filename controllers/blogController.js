const utilsHelper = require("../helpers/utils.helper");
const Blog = require("../models/blog");
const blogController = {};

blogController.getBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);
    const offset = limit * (page - 1);
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { blogs, totalPages },
      null,
      ""
    );
  } catch (err) {
    next(err);
  }
};

blogController.getSingleBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new Error("Blog not found"));

    return utilsHelper.sendResponse(res, 200, true, blog, null, null);
  } catch (error) {
    next(error);
  }
};

//create
blogController.createABlog = async (req, res, next) => {
  try {
    let { userId } = req;
    let { title, content } = req.body;
    console.log(title);
    console.log(content);
    const aNewBlog = await Blog.create({
      title,
      content,
      author: userId,
    });

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { aNewBlog },
      null,
      "Create a blog successful"
    );
  } catch (err) {
    next(err);
  }
};

// update a blog
blogController.updateABlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const author = req.userId;
    const { title, content } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      { _id: blogId, author: author }, //condition
      {
        title,
        content,
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated User : ", docs);
        }
      }
    );
    if (!blog) return next(new Error("Blog not found or User not authorized"));

    return utilsHelper.sendResponse(res, 200, true, blog, null, null);
  } catch (error) {
    next(error);
  }
};

// delete a blog
// update a blog
blogController.deleteABlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const author = req.userId;
    const blog = await Blog.findOneAndUpdate(
      { _id: blogId, author: author }, //condition
      {
        isDeleted: true,
      },
      { new: true }
    );
    if (!blog) return next(new Error("Blog not found or User not authorized"));

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      null,
      null,
      "Delete successful"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = blogController;
