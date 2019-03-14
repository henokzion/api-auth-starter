const JWT = require("jsonwebtoken");

const User = require("../models/users");


const signToken = (user) => {
    return JWT.sign({
        iss: "learningide",
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, "this is a secret")
}

const signUp = async (req, res) => {
    const user = new User({

        local: {
            email: req.body.email,
            password: req.body.password
        },
        method: "local"
    });

    await user.save();

    token = signToken(user);
    res.json({
        token
    });
}

const secret = (req, res) => {
    res.json({
        "message": " this is a secret"
    });
}

const signIn = (req, res) => {
    token = signToken(req.user);
    res.json({
        token
    });
}
const googleOAuth = async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({
        token
    });
}



module.exports = {
    signIn,
    signUp,
    googleOAuth,
    secret
}