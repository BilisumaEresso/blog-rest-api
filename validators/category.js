const {check,param}=require("express-validator")
const mongoose=require("mongoose")

const addCategoryValidator=[
    check("title").notEmpty().withMessage("title required")
]
const idValidator = [
  param("id").custom((id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category id");
    }
    return true; // must return something if valid
  }),
];


module.exports={addCategoryValidator,idValidator}