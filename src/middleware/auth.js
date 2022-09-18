var jwt = require("jsonwebtoken");
const usermodel = require("../models/user");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization.replace("Bearer ", "");
    const verify = await jwt.verify(bearer, process.env.JWT);
    const user = await usermodel.findOne({
      _id: verify._id,
      "tokens.token": bearer,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;

    req.token = bearer;
    next();
  } catch (e) {
    res.status(401).send("Authenticate please");
  }
};

module.exports = auth;
