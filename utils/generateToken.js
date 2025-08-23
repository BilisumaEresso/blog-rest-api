const jwt = require("jsonwebtoken");
const {jwt_secret}=require("../config/keys")


const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        jwt_secret,
        { expiresIn: "7d" ,
            algorithm:"HS256"
        }
    );
};

module.exports = generateToken;