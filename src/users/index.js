const express = require("express");
const router = express.Router();
const passport = require("passport");

const userCtrl = require("./ctrl");
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

router
    .route('/oauth/linkedin')
    .post(userCtrl.signInWithLinkedin);

router
    .route('/request-password-change')
    .post(userCtrl.requestPasswordChange)

router
    .route('/profile/change-password')
    .post(passport.authenticate("jwt", {session : false}), userCtrl.changePassword);

router
    .route('/verify')
    .get(passport.authenticate('verify', {session: false}), userCtrl.verify )
    
module.exports = router;