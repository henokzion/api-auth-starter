const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    method: String,
    local :{ 
        password: String,
        email: String
    }
});

userSchema.pre('save', async function (next) {
    try {
        console.log('entered');
        if (this.method !== 'local') {
            next();
        }

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Generate a password hash (salt + hash)
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        // Re-assign hashed version over original, plain text password
        this.local.password = passwordHash;
        console.log('exited');
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = mongoose.model("User", userSchema);