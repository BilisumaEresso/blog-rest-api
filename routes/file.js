const express=require("express")
const multer=require("multer")
const isAuth=require("../middlewares/isAuth")
const {fileController}=require("../controller")
const upload =require("../middlewares/upload")

const router=express.Router()



router.post("/upload",isAuth,upload.array("image",3),fileController.uploadFile)

module.exports=router