const express=require("express")
const router=express.Router()
const {authController}=require("../controller")
const {signupValidator, signinValidator}=require("../validators/auth")
const validate=require("../validators/validate")
const { signin } = require("../controller/auth")
// const { signup } = require("../controller")
// register route
router.post("/signup",signupValidator,validate,authController.signup)
router.post("/signin",signinValidator,validate,authController.signin)

module.exports=router