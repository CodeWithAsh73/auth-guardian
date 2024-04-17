const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_TOKEN;

const generateToken = (payload, expiresIn) => {
  try {
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
    return token;
  } catch (error) {
    return error.message;
  }
};

const decodeToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, decodeToken };
