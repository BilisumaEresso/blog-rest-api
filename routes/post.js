const express=require("express")
const isAuth = require("../middlewares/isAuth")
const { postController } = require("../controller")
const { addPostValidator, updatePostValidator, deletePostValidator, detailPostValidator } = require("../validators/post")
const validate=require("../validators/validate")
const router=express.Router()

router.post("/",isAuth,addPostValidator,validate,postController.addPost)
router.put("/update-post/:postId",isAuth,updatePostValidator,validate,postController.updatePost)
router.delete("/delete-post/:postId",isAuth,deletePostValidator,validate,postController.deletePost)
router.get("/detail-post/:postId",isAuth,detailPostValidator,validate,postController.detailPost)
router.get("/",isAuth,postController.getPosts)


module.exports=router