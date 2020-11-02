const sgMail = require('@sendgrid/mail');

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