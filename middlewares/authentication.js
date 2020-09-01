const jwt = require("jsonwebtoken");
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_KEY;
const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) return next(new Error("token not found"));
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_TOKEN, (err, payload) => {
      if (err) {
        console.log("err", err);
        if (err.name === "TokenExpiredError") {
          return next(new Error("Token expired"));
        } else {
          return next(new Error("Token is invalid"));
        }
      }
      console.log(payload);
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
