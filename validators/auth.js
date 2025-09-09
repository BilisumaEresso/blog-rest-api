const{check}=require("express-validator")
const validateEmail=require("./emailValidator")
const { default: mongoose } = require("mongoose")

const signupValidator=[check("username").notEmpty().withMessage("name is required"),check("email").notEmpty().withMessage("email is required").isEmail().withMessage("invalid email !"),check("password").notEmpty().withMessage("password is required").isLength({min:6}).withMessage("password should be longer")]

const signinValidator=[check("email").isEmail().withMessage("invalid email").notEmpty().withMessage("empty input!!"),check("password").notEmpty().withMessage("password required").isLength({min:6}).withMessage("the password is short")]

const emailValidator=[check("email").notEmpty().withMessage("email required").isEmail().withMessage("invalid email")]

const codeValidator=[check("code").notEmpty().withMessage("verifiction code required")]

const changePasswordvalidator=[check("oldPassword").notEmpty().withMessage("password required"),check("newPassword").notEmpty().withMessage("new password riquired")]

const updateEmailValidator=[check("email").custom(async(email)=>{
    if(email){
        const isValid=await validateEmail(email)
        if(!isValid){
            throw "email is invalid"
        }
    }
}),
check("profilePic").custom(async(profilePic)=>{
    if(profilePic&& !mongoose.Types.ObjectId){
        throw "invalid profile picture"
    }
})
]

module.exports={signupValidator,signinValidator,emailValidator,codeValidator,changePasswordvalidator,updateEmailValidator}