const jwt = require("jsonwebtoken");
const {jwt_secret}=require("../config/keys")


const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        jwt_secret,
        {
            algorithm: "HS256"
            // No expiresIn field means the token never expires
        }
    );
};

module.exports = generateToken;