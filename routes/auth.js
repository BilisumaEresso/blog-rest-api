const express=require("express")
const router=express.Router()
const {authController}=require("../controller")
// const { signup } = require("../controller")
// register route
router.post("/signup",authController.signup)


module.exports=router