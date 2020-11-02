const {signToken} = require("../_helpers/utils")
const {sendVerifyEmail, sendPasswordChangeEmail} = require("../_helpers/email-manager")
const {VERIFY_EMAILS} = require("../../config")

const User = require("./model");
const UserDal =  require("./dal")

const signUp = async (req, res, next) => {
    try {
        const user = await UserDal.create(req.body, next)
        console.log(user)
        VERIFY_EMAILS && sendVerifyEmail(res, user);
        res.json(user)
    } catch (error) {
        console.log(error)
        next(error)
    }
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



const requestPasswordChange = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await UserDal.findUserByEmail(email);
        sendPasswordChangeEmail(user)
    } catch (error) {
        next(error)
    }
}

const verify = async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({
        token
    });
}
const changePassword = async (req, res)=>{
    if(req.user){
        const user = req.user;
        user.local.password = req.body.password;
        await user.save();
        res.status(200).json({"message": "password changed"})
    }
}

module.exports = {
    signIn,
    signUp,
    secret,
    requestPasswordChange,
    verify,
    changePassword
}