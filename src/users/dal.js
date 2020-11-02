const {ErrorHandler} = require("../_helpers/error")
const User = require("./model")

const create = async (data) => {
    try {
        const foundUser = await findUserByEmail(data.email)
        if (foundUser) {
            throw new ErrorHandler(422, "email already taken")
        }
        const user = new User({
            username: data.username,
            email: data.email,
            password: data.password
        });

        await user.save();

        return user;
    } catch (error) {
        throw error
    }
}

const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw error
    }
}

module.exports = {
    create,
    findUserByEmail
}