const express = require("express");
const User = require("../models/user");
const userRouter = new express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//hashing pwd/////////////////////////////////
const securepwd = async (pwd) => {
  let hashed = await bcrypt.hash(pwd, 4);
  return hashed;
};
//////////////////////////////////////////////

//create user (name,age,email,pwd)////////////
userRouter.post("/users", async (req, res) => {
  let userInfo = req.body;
  userInfo.password = await securepwd(userInfo.password);
  const user = new User(userInfo);
  const token = jwt.sign({ _id: user._id.toString() }, "shhhhh");
  user.tokens = user.tokens.concat({ token: token });
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
/////////////////////////////////////////////
//logout/////////////////////////////////////
userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    req.user.save();
    res.send(req.user.tokens);
  } catch (e) {
    res.status(500).send();
  }
});

//get profile//////////////////////////////
userRouter.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////////////////////////////////////

//get user by id/////////////////////////////
userRouter.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});
/////////////////////////////////////////////

//patch user by id///////////////////////////
userRouter.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
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

    res.send(user);
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});
/////////////////////////////////////////////

//delete user ///////////////////////////////
userRouter.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const user = await User.findByIdAndRemove(_id, { new: true });
  if (!user) {
    res.status(404).send();
  }
  res.status(200).send();
  await user.save();
});
/////////////////////////////////////////////

module.exports = userRouter;
