const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    method: String,
    local: {
        password: String,
        email: String,
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    confirmed: {
        type: Boolean,
        "default": false
    },
    linkedin: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
});

userSchema.pre('save', async function (next) {
    const user = this;
    try {
        if (this.method !== 'local' || !user.isModified('local')) {
            next();
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        this.local.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = mongoose.model("User", userSchema);