const {check}=require("express-validator")

const addCategoryValidator=[
    check("title").notEmpty().withMessage("title required")
]

module.exports={addCategoryValidator}