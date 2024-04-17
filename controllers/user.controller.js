const User = require("../models/user.model");
const sendEmail = require("../services/email.service");
const { isEmail, isStrongPassword, isJWT } = require("validator");
const { decodeToken } = require("../services/token.service");
const {
  userVerificationTemplate,
  userPasswordResetTemplate,
} = require("../services/templates.service");
const responseHandler = require("../handlers/response.handler");
const ApiError = require("../handlers/error.handler");
const { postUserSignupValidator } = require("../services/validator.service");

const postUser = async (req, res) => {
  const { name, email, password, mobile, state, city } = req.body;
  try {
    console.log(req.body);
  
    postUserSignupValidator(name, email, password, mobile, city, state);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User already registered");
    }
    const avatar = req.file ? req.file.filename : null;
    const user = await User.create({ name, email, password, mobile, avatar, state, city });

    const verificationToken = user.createEmailVerificationToken();
    const verificationLink = `${process.env.BASE_URL}/api/v1/auth/verify/${verificationToken}`;
    const checkMail = await sendEmail(email, userVerificationTemplate(name, verificationLink));
    console.log(checkMail);
    return res
      .status(201)
      .json(responseHandler(201, "User created successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message,
          "User not created",
        ),
      );
  }
};

const generateResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) throw new ApiError(400, "Email is required");
    if (!isEmail(email)) throw new ApiError(400, "Invalid Email");
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");
    const resetToken = user.generatePasswordResetToken();
    await user.save();
    const resetLink = `${process.env.BASE_URL}/api/v1/user/reset-password/${resetToken}`;
    await sendEmail(email, userPasswordResetTemplate(user.name, resetLink));
    return res
      .status(200)
      .json(responseHandler(200, "Password reset link sent to your email"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

const postResetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  try {
    if (!isJWT(token)) throw new ApiError(400, "Invalid Token");
    if (!password || !confirmPassword)
      throw new ApiError(400, "All fields required");
    const { _id } = decodeToken(token);
    const user = await User.findById(_id);
    if (!user) throw new ApiError(404, "User not found");
    if (password !== confirmPassword)
      throw new ApiError(400, "Passwords do not match");
    user.password = password;
    if (!isStrongPassword(password))
      throw new ApiError(400, "Password Not Strong");
    await user.save();
    return res
      .status(200)
      .json(responseHandler(200, "Password reset successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};
module.exports = {
  postUser,
  postResetPassword,
  generateResetPasswordEmail,
};
