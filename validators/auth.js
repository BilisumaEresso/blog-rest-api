const{check}=require("express-validator")

const signupValidator=[check("username").notEmpty().withMessage("name is required"),check("email").notEmpty().withMessage("email is required").isEmail().withMessage("invalid email !"),check("password").notEmpty().withMessage("password is required").isLength({min:6}).withMessage("password should be longer")]

const signinValidator=[check("email").isEmail().withMessage("invalid email").notEmpty().withMessage("empty input!!"),check("password").notEmpty().withMessage("password required").isLength({min:6}).withMessage("the password is short")]

const emailValidator=[check("email").notEmpty().withMessage("email required").isEmail().withMessage("invalid email")]

const codeValidator=[check("code").notEmpty().withMessage("verifiction code required")]

const changePasswordvalidator=[check("oldPassword").notEmpty().withMessage("password required"),check("newPassword").notEmpty().withMessage("new password riquired")]
module.exports={signupValidator,signinValidator,emailValidator,codeValidator,changePasswordvalidator}