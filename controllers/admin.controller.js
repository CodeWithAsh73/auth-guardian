const User = require("../models/user.model");
const ApiError = require("../handlers/error.handler");
const responseHandler = require("../handlers/response.handler");
const fs = require("fs");
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -createdAt -updatedAt");
    return res.status(200).json(
      responseHandler(200, "Users", {
        total_users: users.length,
        users,
      }),
    );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};
const changeUserStatus = async (req, res) => {
  const { _id } = req.params;
  if(!_id) throw new ApiError(400, "User Id Required");

  try {
    if(_id===req.user._id) throw new ApiError(403, "You can't change your own status");
    const user = await User.findById(_id);
    if (!user) throw new ApiError(404, "User Not Found");
    user.isActive = !user.isActive;
    await user.save();
    return res
      .status(200)
      .json(responseHandler(200, "User Type Changed Successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

const getUserById = async (req, res) => {
  const { _id } = req.params;
  if(!_id) throw new ApiError(400, "User Id Required");

  try {
    const user = await User.findById(_id).select("-password -createdAt -updatedAt");
    if (!user) throw new ApiError(404, "User Not Found");
    return res
      .status(200)
      .json(responseHandler(200, "User Details", { user }));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};
const deleteUserById = async (req, res) => {    
  const { _id } = req.params;
  if(!_id) throw new ApiError(400, "User Id Required");
  try {
    if(_id===req.user._id) throw new ApiError(403, "Cannot Delete Yourself");
    const user = await User.findByIdAndDelete(_id);
    if (!user) throw new ApiError(404, "User Not Found");
    const avatarUrl = `./public/uploads/avatars/${user.avatar}`
    if(fs.existsSync(avatarUrl)) fs.unlinkSync(`./public/uploads/avatars/${user.avatar}`)

    return res
      .status(200)
      .json(responseHandler(200, "User Deleted Successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
}
module.exports = {
  getAllUsers,
  changeUserStatus,
  getUserById,
  deleteUserById
};