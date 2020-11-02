const User = require("./model")

const create = async (data) => {
    try {
        const foundUser = await findUserByEmail(data.email)
        if (foundUser) {
            return res.status(403).json({
                error: 'Email is already in use'
            });
        }
        const user = new User({
            username: req.body.username,

            email: req.body.email,
            password: req.body.password
        });

        await user.save();
    } catch (error) {

    }
}

const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {

    }
}

module.exports = {
    create,
    findUserByEmail
}