const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const {
    ExtractJwt
} = require("passport-jwt");

const User = require("./models/users");
const config = require('./configuration');

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

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Should have full user profile over here
        console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);

        const existingUser = await User.findOne({
            "google.id": profile.id
        });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }
}));

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