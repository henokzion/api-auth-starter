const signUp = (req, res) => {
    res.json({"message" : "signup"});
}

const signIn = (req, res) => {
    res.json({"message" : "signIn"});
}

module.exports = {
    signIn,
    signup
}