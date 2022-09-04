var jwt = require("jsonwebtoken");
const usermodel = require("../models/user");
const auth = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization.replace("Bearer ", "");
    const verify = await jwt.verify(bearer, "shhhhh");
    const user = await usermodel.findOne({
      _id: verify._id,
      "tokens.token": bearer,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user.toJSON();
    req.token = bearer;
    next();
  } catch (e) {
    res.status(401).send("Authenticate please");
  }
};

module.exports = auth;
