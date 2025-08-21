const express=require("express")
const router=express.Router()
const {authController}=require("../controller")
const {signupValidator}=require("../validators/auth")
const validate=require("../validators/validate")
// const { signup } = require("../controller")
// register route
router.post("/signup",signupValidator,validate,authController.signup)


module.exports=router