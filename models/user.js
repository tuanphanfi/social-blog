const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friendCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
});

userSchema.plugin(require("./plugins/isDeletedFalse"));

userSchema.pre("save", async function (next) {
  // doc.save() = this.save
  // this === doc (mongoose syntax)
  const salt = await bcrypt.genSalt(10);
  console.log("in  save");

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, salt);
    console.log("aaa");
  }
  console.log("aaabbbbbbbb");
  next();
});

// query middleware
userSchema.pre(/findOneAndUpdate/, async function (next) {
  const newUpdate = this._update;
  const salt = await bcrypt.genSalt(10);
  console.log(this);

  if (newUpdate.password) {
    this._update.password = await bcrypt.hash(newUpdate.password, salt);
  }

  next();
});

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return accessToken;
};

module.exports = mongoose.model("User", userSchema);
