const express = require("express");
const router = express.Router();

const userCtrl = require("./ctrl");
const {passportJwt, passportLocal, passportVerify, passportGoogle} = require("../passport");

router
    .route("/signup")
    .post(userCtrl.signUp);

router
    .route("/signin")
    .post(passportLocal, userCtrl.signIn);

router
    .route("/secret")
    .get(passportJwt, userCtrl.secret);

router.route('/oauth/google')
    .post(passportGoogle, userCtrl.googleOAuth);

router
    .route('/oauth/linkedin')
    .post(userCtrl.signInWithLinkedin);

router
    .route('/request-password-change')
    .post(userCtrl.requestPasswordChange)

router
    .route('/profile/change-password')
    .post(passportJwt, userCtrl.changePassword);

router
    .route('/verify')
    .get(passportVerify, userCtrl.verify )
    
module.exports = router;