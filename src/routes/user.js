const express = require("express");
const User = require("../models/user");
const userRouter = new express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an image file"));
    }
    cb(undefined, true);
  },
});
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
//adding image to profile
userRouter.post(
  "/users/me/avatar",
  upload.single("avatar"),
  (err, req, res, next) => {
    res.status(400).send("please provide image file");
  },
  auth,
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("saved successfully");
  }
);
//delete avatar
userRouter.delete("/users/me/avatar", auth, async (req, res) => {
  if (!req.user.avatar) {
    return res.status(400).send("no image found");
  }
  req.user.avatar = undefined;
  await req.user.save();
  res.send("image deleted successfully");
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

//serve avatars

userRouter.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = userRouter;
