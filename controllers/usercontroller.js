const utilsHelper = require("../helpers/utils.helper");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const userController = {};
const mailgun = require("mailgun-js");
const jwt = require("jsonwebtoken");

userController.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return next(new Error("User already exists"));

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password,
    });

    const accessToken = await user.generateToken();

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Create user successful"
    );
  } catch (err) {
    next(err);
  }
};

userController.updateInfo = async (req, res, next) => {
  try {
    let { userId } = req;
    let { name, password } = req.body;

    /*
    const user = {};
    if (name) user.name = name;
    if (password) user.password = password;
    const newUser = await User.findByIdAndUpdate(
      userId, 
      user,
      {new: true}
    );

    */

    const user = {};
    if (name) user.name = name;
    // const salt = await bcrypt.genSalt(10);
    // if (password) user.password = await bcrypt.hash(password, salt);
    if (password) user.password = password;

    const newUser = await User.findOneAndUpdate(
      { _id: userId }, //condition
      user,
      { new: true } //return a new object after done
    );

    // console.log(newUser);

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      newUser,
      null,
      "Update USER successful"
    );
  } catch (error) {
    next(error);
  }
};

userController.forgetPassword = async (req, res, next) => {
  try {
    // get email from request
    const email = req.params.email;
    if (!email) {
      return next(new Error("Email is required"));
    }
    // get user doc from database
    const user = await User.findOne({ email });
    if (!user) {
      return utilsHelper.sendResponse(
        res,
        200,
        true,
        null,
        null,
        "You will receive an email in your registered email address"
      );
    }
    // generate a jwt (include userID)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    // SEND EMAIL
    const API_KEY = process.env.MAILGUN_API;
    const DOMAIN = process.env.MAILGUN_DOMAIN;
    const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });
    const data = {
      from: "khoa <damanhkhoa@gmail.com>",
      to: user.email,
      subject: "Reset password confirmation",
      html: `click <a href="http://localhost:5000/email/${token}">here</a> to reset password`,
    };
    mailgun.messages().send(data, (error, body) => {
      console.log(body);
      if (error) return next(body);
    });

    // send email with token to user email
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      null,
      null,
      "You will receive an email in your registered email address"
    );
  } catch (error) {
    next(error);
  }
};

userController.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return next(new Error("token and password are required"));

    //verify token:
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!payload) return next(new Error("invalid token"));
    // payload_id = useid
    // update password;
    // const user = await User.findByIdAndUpdate(payload._id, { password });

    const user = await User.findById(payload._id);
    user.password = password;
    await user.save();

    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
