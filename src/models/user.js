const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const usermodel = new mongoose.Schema(
  {
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
      unique: true,
      lowercase: true,
      required: true,

      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Wrong email");
        }
      },
    },
    avatar: {
      type: Buffer,
    },

    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
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
  },
  {
    timestamps: true,
  }
);
usermodel.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

const user = mongoose.model("users", usermodel);
module.exports = user;
