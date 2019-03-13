const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const User = require("./models/users");

const JWT_SECRET = "this is a secret";

passport.use( new JwtStrategy({
    jwtFromRequest : ExtractJwt.fromHeader("authorization"),
    secretOrKey : JWT_SECRET
}, async(payload, done) => {
    try {
        const user = await User.findById(payload.sub);

        if(!user){
            return done(null, false);
        }

        done(null, user);
    } catch (error) {
        done(error, false)
    }
}))