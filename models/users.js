const mongoose = require("mongoose");

const userSchma = new mongoose.Schema({
    email: String,
    password : String
});

module.exports = mongoose.Model("User", userSchma);
