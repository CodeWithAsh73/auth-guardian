const express = require("express");
const {
  getAllUsers,
  getUserById,
  changeUserStatus,
  deleteUserById,
} = require("../controllers/admin.controller");

const router = express.Router();

router.route("/users").get(getAllUsers);
router.route("/user/:_id").get(getUserById).delete(deleteUserById);


router.route("/user/:_id/change-status").patch(changeUserStatus);

module.exports = router;
