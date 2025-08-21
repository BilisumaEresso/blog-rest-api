const{check}=require("express-validator")

const signupValidator=[check("username").notEmpty().withMessage("name is required"),check("email").notEmpty().withMessage("email is required").isEmail().withMessage("invalid email !"),check("password").notEmpty().withMessage("password is required").isLength({min:6}).withMessage("password should be longer")]

module.exports={signupValidator}