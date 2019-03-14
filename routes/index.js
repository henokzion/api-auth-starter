const express = require("express");
const router = express.Router();
const passport = require("passport");

const userCtrl = require("../controllers/users");
const passportConf = require("../passport");

router
    .route("/signup")
    .post(userCtrl.signUp);

router
    .route("/signin")
    .post(passport.authenticate("local", {session : false}), userCtrl.signIn);

router
    .route("/secret")
    .get(passport.authenticate("jwt", {session : false}), userCtrl.secret);

router.route('/oauth/google')
    .post(passport.authenticate('googleToken', { session: false }), userCtrl.googleOAuth);
module.exports = router;