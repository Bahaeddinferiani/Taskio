const express = require("express");
const User = require("../models/user");
const userRouter = new express.Router();

//create user (name,age,email,pwd)////////////
userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
/////////////////////////////////////////////

//get all users//////////////////////////////
userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
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
    return true;
  };
  try {
    let verification = await verify();
    if (!verification) {
      return res.status(404).send();
    }
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
    await user.save();

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
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
