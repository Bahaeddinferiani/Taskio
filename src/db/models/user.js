const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const usermodel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    required: true,
    type: Number,
  },
  email: {
    type: String,
    required: true,

    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error("Wrong email");
      }
    },
  },
  password: {
    type: String,
    required: true,

    trim: true,
    validate(pass) {
      if (pass.length < 6 || pass == "password") {
        throw new Error("Password is weak");
      }
    },
  },
});

const user = mongoose.model("users", usermodel);
module.exports = user;
