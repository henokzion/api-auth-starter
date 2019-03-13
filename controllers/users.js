const User = require("../models/users");

const signUp = async (req, res) => {
    const user = new User({   
        email: req.body.email,
        password : req.body.password
    });

    await user.save();
    res.json(user);
}

const signIn = (req, res) => {
    res.json({"message" : "signIn"});
}

module.exports = {
    signIn,

    signUp
}