const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/users");

router
    .route("/signup")
    .post(userCtrl.signUp);

router
    .route("/signin")
    .post(userCtrl.signIn);

module.exports = router;