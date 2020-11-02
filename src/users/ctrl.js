const JWT = require("jsonwebtoken");
const querystring = require("query-string")
var request = require('request');
const sgMail = require('@sendgrid/mail');

const User = require("./model");


const signToken = (user) => {
    return JWT.sign({
        iss: "learningide",
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, "this is a secret")
}

var sendVerifyEmail = (res, user) => {
    const token = signToken(user);
    var verificationText = `http://localhost:3000/confirmation?verify=${token}`;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: user.local.email,
        from: 'noreply@briter.com',
        subject: 'verify your email',
        text: verificationText
    };
    sgMail.send(msg);
    res.status(200).json({
        "message": "not verified"
    });
}

const signUp = async (req, res) => {
    const foundUser = await User.findOne({
        "local.email": req.body.email
    });
    if (foundUser) {
        return res.status(403).json({
            error: 'Email is already in use'
        });
    }
    console.log(foundUser)
    const user = new User({
        username: req.body.username,
        local: {
            email: req.body.email,
            password: req.body.password
        },
        method: "local"
    });

    await user.save();

    sendVerifyEmail(res, user);
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

var sendPasswordChangeEmail = async (res, user) => {
        console.log(process.env.SENDGRID_API_KEY)
    try {
        const token = signToken(user);
        var verificationText = `http://localhost:3000/changepasswordverify?verify=${token}`;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: user.local.email,
            from: 'noreply@briter.com',
            subject: 'Change Your password',
            text: verificationText
        };
        const mail = sgMail.send(msg);
        console.log(mail);
        res.status(200).json({
            "message": "not verified"
        });
    } catch (error) {
        res.json(error)
    }

}

const requestPasswordChange = async (req, res) => {
    if (req.body.email) {
        User
            .findOne({
                method: 'local',
                "local.email": req.body.email
            })
            .exec((err, user) => {
                if (err)
                    return res.status(400).json(err);
                if (user)
                    sendPasswordChangeEmail(res, user);
                else
                    res.status(404).json({
                        "message": "user not found"
                    });
            })

    } else {
        res.json({
            "message": "please provide a valid email"
        });
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