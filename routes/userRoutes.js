const express = require("express");

const { signupUser, loginUser } = require("../controllers/userControllers");

const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);

module.exports = router;
