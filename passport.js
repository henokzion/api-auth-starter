const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const {
    ExtractJwt
} = require("passport-jwt");

const User = require("./models/users");

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
            "local.email": email
        });

        
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