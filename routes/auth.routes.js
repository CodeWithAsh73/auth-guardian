const express = require("express");
const {postLogin, verifyEmail, currentUser, postLogoutUser, postResetPassword} = require("../controllers/auth.controller");
const {auth} = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/login").post(postLogin);
router.route("/verify/:verificationToken").get(verifyEmail)
router.route("/current-user").get(auth,currentUser)
router.route("/logout").get(auth,postLogoutUser)

router.route('/change-password').post(auth,postResetPassword)
module.exports = router