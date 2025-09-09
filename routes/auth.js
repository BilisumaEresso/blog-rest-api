const express=require("express")
const router=express.Router()
const {authController}=require("../controller")
const {signupValidator, signinValidator, emailValidator,codeValidator, changePasswordvalidator, updateEmailValidator}=require("../validators/auth")
const validate=require("../validators/validate")
const isAuth=require("../middlewares/isAuth")

// const { signup } = require("../controller")
// register route
router.post("/signup",signupValidator,validate,authController.signup)
router.post("/signin",signinValidator,validate,authController.signin)

router.post("/send-verification-email",emailValidator,validate,authController.verifyCode)
router.post("/user-verification",emailValidator,codeValidator,validate,authController.verifyUser)
router.post("/forgot-password",emailValidator,validate,authController.forgotPassword)
router.post("/reset-password",emailValidator,codeValidator,validate,authController.resetPassword)
router.put(
  "/change-password",
  changePasswordvalidator,validate,isAuth,
  authController.changePassword
);
router.put("/update-profile",updateEmailValidator,isAuth,validate,authController.updateProfile)
router.get("/current-user",isAuth,authController.currentUser)


module.exports=router