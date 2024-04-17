const jwt = require("jsonwebtoken");
const errorHandler = require("../handlers/error.handler");
const User = require("../models/user.model");
const SECRET_TOKEN = process.env.SECRET_TOKEN;

const auth = (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new errorHandler(401, "Token Not Found");
    }
    const payload = jwt.verify(token, SECRET_TOKEN);
    console.log(payload);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(error.statusCode || 500).json(new errorHandler(error.statusCode || 500, error.message));
  }
};
const authToAdminOnly = async(req, res, next) => {
  try {
    const {_id} = req.user
    const user = await User.findById(_id)
    if (!user) {
      throw new errorHandler(404, "User Not Found");
    }
    if (user.role !== "admin" ) {
      throw new errorHandler(403, "Access Denied");
    }
    next();
  } catch (error) {
    return res.status(error.statusCode || 500).json(new errorHandler(error.statusCode || 500, error.message));
  }
};

module.exports = {auth, authToAdminOnly};
