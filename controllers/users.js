const JWT = require("jsonwebtoken");

const User = require("../models/users");

const signToken = (user) =>{
    return JWT.sign({
        iss: "learningide",
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, "this is a secret")
}

const signUp = async (req, res) => {
    const user = new User({   
        email: req.body.email,
        password : req.body.password
    });

    await user.save();
    
    token = signToken(user);
    res.json({token});
}

const signIn = (req, res) => {
    token = signToken(user);
    res.json({token});
}

module.exports = {
    signIn,

    signUp
}