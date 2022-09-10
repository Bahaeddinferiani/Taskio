const express = require("express");
const User = require("../models/user");
const userRouter = new express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//hashing pwd
const securepwd = async (pwd) => {
  let hashed = await bcrypt.hash(pwd, 4);
  return hashed;
};

//create user
userRouter.post("/users", async (req, res) => {
  let userInfo = req.body;
  userInfo.password = await securepwd(userInfo.password);
  const user = new User(userInfo);
  const token = jwt.sign({ _id: user._id.toString() }, "shhhhh");
  user.tokens = user.tokens.concat({ token: token });
  try {
    await user.save();
    res.status(201).send(user.toJSON());
  } catch (e) {
    res.status(400).send(e);
  }
});
//file
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match("/.(doc|docx|doc)$/")) {
      return cb(new Error("Please upload a word doc"));
    }
    cb(undefined, true);
  },
});
userRouter.post("/profile", upload.single("avatar"), function (req, res) {
  const data = req.file;
  res.send(data);
});

//logout
userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    req.user.save();
    res.send(req.user.toJSON());
  } catch (e) {
    res.status(500).send();
  }
});

//get profile
userRouter.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user.toJSON());
  } catch (e) {
    res.status(500).send();
  }
});

//patch user
userRouter.patch("/users/me", auth, async (req, res) => {
  const _id = req.user._id;
  const fields = ["age", "name", "password", "email"];
  const keys = Object.keys(req.body);
  const verify = async () => {
    for (i in keys) {
      if (fields.includes(keys[i]) === false) {
        return false;
      }
    }
    if (keys.includes("password")) {
      req.body.password = await securepwd(req.body.password);
    }
    return true;
  };
  try {
    let verification = await verify();
    if (!verification) {
      return res.status(404).send();
    }
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    await user.save();

    if (!user) {
      return res.status(404).send();
    }

    res.send(user.toJSON());
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});

//delete user
userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user.toJSON());
  } catch (e) {
    console.log(e);
    res.status(500).send("error deleting profile");
  }
});

module.exports = userRouter;
