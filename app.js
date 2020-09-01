var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const utilsHelper = require("./helpers/utils.helper");
const cors = require("cors");

// mongoose
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

// route
var indexRouter = require("./routes/index");

/* DB Connections */
mongoose.plugin(require("./models/plugins/modifiedAt"));
mongoose
  .connect(mongoURI, {
    // some options to deal with deprecated warning
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Mongoose connected to ${mongoURI}`);
    // test
    // require("./testing/testSchema");
  })
  .catch((err) => console.log(err));

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

/* Initialize Routes */
app.use("/api", indexRouter);
// catch 404 and forard to error handler
app.use((req, res, next) => {
  const err = new Error("URL Not Found");
  err.statusCode = 404;
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return utilsHelper.sendResponse(
    res,
    err.statysCode ? err.statusCode : 500,
    false,
    null,
    [{ message: err.message }]
  );
  if (err.statusCode === 404) {
    return utilsHelper.sendResponse(res, 404, false, null, err, null, null);
  } else {
    console.log("ERROR", err);
    return utilsHelper.sendResponse(res, 500, false, null, err, null, null);
  }
});

app.use((err, req, res, next) => {
  if (process.env.ENV_MODE === "development") {
    return utilsHelper.sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      err.stack,
      err.message
    );
  } else {
    return utilsHelper.sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      null,
      err.message
    );
  }
});

module.exports = app;
