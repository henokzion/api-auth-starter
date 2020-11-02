const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const {
    ExtractJwt
} = require("passport-jwt");

const User = require("./users/model");
const config = require('../config');

const JWT_SECRET = "this is a secret";

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);

        if (!user) {
            return done(null, false);
        }

        done(null, user);
    } catch (error) {
        done(error, false)
    }
}))

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        // Find the user given the email
        const user = await User.findOne({
            "email": email
        });

        console.log(email)

        if (!user) {
            return done(null, false);
        }

        const isMatch = await user.isValidPassword(password);


        if (!isMatch) {
            return done(null, false);
        }

        done(null, user);
    } catch (error) {
        done(error, false);
    }
}))


passport.use('verify', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('verify'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        user.confirmed = true;
        await user.save();
        if (!user) {
            return done(null, false);
        }

        done(null, user);
    } catch (error) {
        done(error, false);
    }
}))

module.exports = {
    passportLocal : passport.authenticate("local", {session : false}),
    passportJwt : passport.authenticate("jwt", {session : false}),
    passportVerify : passport.authenticate('verify', {session: false})
}