const {Category} =require("../models")
const {User}=require("../models")

const addCategory=async(req,res,next)=>{
    try{
        const {title,desc}=req.body
        const {_id}=req.user
        const exist= await Category.findOne({title})
        if (exist){
            res.code=400
            throw new Error ("category already exist")
        }
        const user= await User.findById(_id).select("-password -verificationCode -isVerifed")
        if(!user){
            res.code=404
            throw new Error("user not found")
        }
        const newCategory= new Category({title,desc,updatedBy:_id})
        await newCategory.save()
        res.status(200).json({code:200,status:true,message:"category added successfully"})
    }catch(error){
        next(error)
    }
}

const updateCategory=async(req,res,next)=>{
    try{
        const {id}=req.params
        const {title,desc}=req.body
        const category= await Category.findById(id)
        if (!category){
            res.code=400
            throw new Error("category not found")
        }
        const titleExist= await Category.findOne({title})
        if (titleExist){
            res.code=400
            throw new Error("category already exist")
        }
        category.title=title
        if(desc) category.desc=desc
       await category.save()
       res.status(200).json({
        code:200,
        status:true,
        message:"Category updated successfully"
       })
    }catch(error){
        next(error)
    }
}

module.exports={addCategory,updateCategory}