const { isEmail, isStrongPassword, isMobilePhone } = require("validator");
const ApiError = require("../handlers/error.handler");
const postUserSignupValidator = (name, email, password, mobile, city, state) => {
  if (!name || !email || !password || !mobile || !city || !state) {

    throw new ApiError(400, "All Fields Required!");
  }
  if (name.length < 3) throw new ApiError(400, "Invalid Name!");

  if (!isEmail(email)) throw new ApiError("Invalid Email");
  if (!isStrongPassword(password))
    throw new ApiError("Strong Password Required!");
  if (!isMobilePhone(mobile, "any"))
    throw new ApiError("Invalid Mobile Number");

};

const postLoginValidator = (email, password) => {
  if (!email) throw new ApiError(400, "Email Required!");
  if (!password) throw new ApiError(400, "Password Required!");
  if (!isEmail(email)) throw new ApiError(400, "Email Not Valid");
};

module.exports = { postUserSignupValidator, postLoginValidator };
