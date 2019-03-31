const JWT = require("jsonwebtoken");
const querystring = require("query-string")
var request = require('request');
const sgMail = require('@sendgrid/mail');

const User = require("../models/users");


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
    
    sgMail.setApiKey("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");
    const msg = {
        to: user.local.email,
        from: 'noreply@briter.com',
        subject: 'verify your email',
        text: verificationText
    };
    sgMail.send(msg);
    res.status(200).json({"message": "not verified"});
}

const signUp = async (req, res) => {
    const foundUser = await User.findOne({
        "local.email" : req.body.email
    });
    if (foundUser) {
        return res.status(403).json({
            error: 'Email is already in use'
        });
    }
    console.log(foundUser)
    const user = new User({

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
const googleOAuth = async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({
        token
    });
}


var getLinkedinInfo = (res, access_token)=>{
    //https://api.linkedin.com/v2/me
    request({
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
        uri : "https://api.linkedin.com/v2/people/~:(id,email-address?format=json",
        method : "GET"
    }, (err, result, body)=>{
        if(err){
            console.log(err);
            res.json(err);
        }
        body=JSON.parse(body);
        console.log(body);
        saveLinkedinInfo(res, body);
    })
}

var saveLinkedinInfo = async (res, profile)=>{
    const existingUser = await User.findOne({ "linkedin.id": profile.id });
    if(existingUser){
        const token = signToken(existingUser);
        return res.status(200).json({
            token
        });
    }

    const newUser = new User({
        method: "linkedin",
        linkedin: {
            id : profile.id ,
            email : profile.emailAddress
        },
       
    });

    await newUser.save();

    token = signToken(newUser);
    res.status(200).json({token});

}

const signInWithLinkedin = async (req, res, next) => {
    var data = {
        grant_type: "authorization_code",
        code : req.body.code,
        redirect_uri: "http://localhost:3000/linkedin",
        client_id: "77km4hwlu5w8xt",
        client_secret: "Vo23lvnW6Cmy29x8"
    }
    var formData = querystring.stringify(data);
    var contentLength = formData.length;
    console.log(formData);
    
    request({
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'https://www.linkedin.com/oauth/v2/accessToken',
        body: formData,
        method: 'POST'
      }, function (err, result, body) {
        //it works!
        if(err){
                console.log(err);
                res.json(error);
            }
            console.log(JSON.parse(body).access_token);
            access_token = JSON.parse(body).access_token;
            getLinkedinInfo(res, access_token);
      });
}
var sendPasswordChangeEmail = async (res, user) => {
    const token = signToken(user);

    //"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"
    var verificationText = `http://localhost:3000/changepasswordverify?verify=${token}`;
    
    sgMail.setApiKey("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");
    const msg = {
        to: user.local.email,
        from: 'noreply@briter.com',
        subject: 'Change Your password',
        text: verificationText
    };
    sgMail.send(msg);
    res.status(200).json({"message": "not verified"});
}

const requestPasswordChange = async (req, res)=>{
    if(req.body.email){
        User
            .findOne({method : 'local', "local.email" : req.body.email})
            .exec((err, user)=>{
                if(err)
                    return res.status(400).json(err);
                if(user)
                    sendPasswordChangeEmail(res, user);
                else
                    res.status(404).json({"message":"user not found"});
            })
    
    }else{
        res.json({"message": "please provide a valid email"});
    }
}

verify = async(req, res, next)=>{
    const token = signToken(req.user);
    res.status(200).json({
        token
    });
}

module.exports = {
    signIn,
    signUp,
    googleOAuth,
    secret,
    signInWithLinkedin,
    requestPasswordChange
}