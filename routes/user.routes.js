const express = require("express");
const router = express.Router();
const { postUser, postResetPassword, generateResetPasswordEmail } = require("../controllers/user.controller");
const upload = require("../services/multer.service");
const { postUserSignupValidator } = require("../services/validator.service");

// router.post('/signup',[postUserSignupValidator,upload.single('avatar')],postUser)
router.route("/signup").post(upload.single("avatar"), postUser);
router.route('/forgot-password').post(generateResetPasswordEmail)
router.route("/reset-password/:token").post(postResetPassword)

module.exports = router;
