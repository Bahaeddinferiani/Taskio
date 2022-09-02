const express = require("express");
const loginRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const user = require("../models/user");
var jwt = require("jsonwebtoken");

//login user//////////////////////////////////

loginRouter.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (password === undefined || email === undefined) {
    return res.status(404).send("please fill password &/or email");
  } else if (validator.isEmail(email) === false) {
    return res.status(400).send("email not valid");
  }

  const userInfo = await user.findOne({ email });

  if (Object.keys(userInfo).length === 0) {
    return res.status(404).send("no accounts found");
  }

  let access = await bcrypt.compare(password, userInfo.password);
  const token = jwt.sign({ _id: userInfo._id.toString() }, "shhhhh");
  var decoded = await jwt.verify(token, "shhhhh");
  userInfo.tokens = userInfo.tokens.concat({ token: token });
  userInfo.save();
  if (access) {
    return res.send(userInfo);
  }
  res.send("Password is incorrect!");
});
//////////////////////////////////////////////

module.exports = loginRouter;
