"use strict";
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const user = new mongoose.Schema(
  {
    fullname: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String, trim: true },
    phoneno: { type: String, trim: true },
    gender: { type: String },
    hobbies: { type: [String] },
    Country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: Number, trim: true },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
user.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
module.exports = mongoose.model("user", user);
