const {Category} =require("../models")
const {User}=require("../models")
const { findByIdAndDelete, findById } = require("../models/User")

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
        const {_id}=req.user
        const {title,desc}=req.body
        const user =await User.findById(_id)
        const category= await Category.findById(id)
        if (!category){
            res.code=404
            throw new Error("category not found")
        }
       const categoryExist = await Category.findOne({ title: title.trim() });
       if (
         (categoryExist &&
         String(category._id) !== String(categoryExist._id))||category.title===title
       ) {
         res.code = 400;
         throw new Error("Category already exists");
       }

        if (!user) {
          res.code = 404;
          throw new Error("user not found");
        }
        
        category.title=title
        if(desc) category.desc=desc
        category.updatedBy=_id
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
const deleteCategory=async(req,res,next)=>{
    try{
        const {id}=req.params
        const category= await Category.findById(id)
        if(!category){
           res.code=404
           throw new Error("category not found") 
        }
        await Category.findByIdAndDelete(id)
        res.status(200).json({
            code:200,
            status:true,
            message:"category deleted successfully"

        })

    }catch(error){
        next(error)
    }
}
const searchCategory=async(req,res,next)=>{
    try{
        const {q,page,limit}=req.query
        const limitNumber=parseInt(limit)||10
        const pageNumber=parseInt(page)||1

        let query={}
        if(q){
            const search=RegExp(q,"i")
           query={$or:[{title:search},{desc:search}]}
        }
        const total=await Category.countDocuments(query)
        const pages=Math.ceil(total/limitNumber)

        const category = await Category.find(query).skip((pageNumber-1)*limitNumber).limit(limitNumber)
        res.json({data:category})
    }catch(error){
        next(error)
    }
}
const detaillCategory=async(req,res,next)=>{
    try{
        const {id}=req.params
        const category= await Category.findById(id)
        if (!category){
            res.code=404
            throw new Error("category not found")
        }
        res.status(200).json({
            code:200,
            status:true,
            data:category
        })
    }catch(error){
        next(error)
    }
}

module.exports={addCategory,updateCategory,deleteCategory,searchCategory,detaillCategory}