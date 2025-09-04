const express=require("express")
const {categoryController}=require("../controller/index")
const {addCategoryValidator}=require("../validators/category")
const validate=require("../validators/validate")
const isAuth=require("../middlewares/isAuth")
const isAdmin=require("../middlewares/isAdmin")
const router=express.Router()
router.post(
  "/",
  isAuth,isAdmin,addCategoryValidator,
  validate,
  categoryController.addCategory
);

router.post("/:id",isAuth,isAdmin,addCategoryValidator,categoryController.updateCategory)



module.exports = router;