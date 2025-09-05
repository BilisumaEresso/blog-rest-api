const express=require("express")
const {categoryController}=require("../controller/index")
const {addCategoryValidator,idValidator}=require("../validators/category")
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

router.put("/:id",isAuth,isAdmin,idValidator,validate,categoryController.updateCategory)
router.delete("/:id",isAuth,isAdmin,idValidator,validate,categoryController.deleteCategory)
router.get("/",isAuth,categoryController.searchCategory)
router.get("/:id",isAuth,idValidator,validate,categoryController.detaillCategory)



module.exports = router;