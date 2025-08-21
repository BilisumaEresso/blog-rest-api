const User=require("../models")
const hashPassword=require("../utils/hashPassword")
const comparePassword=require("../utils/comparePassword")

const signup=async(req,res, next)=>{
    try{
        const {username,email,password,role}=req.body
        const emailExist=await User.findOne({email})
        if (emailExist){
           return res.status(400).json({
                code:400,
                status:false,
                message:"email already exist try to sign in"
            })
        
        }
        
        const hashedPassword=await hashPassword(password)
        const user=new User({username,email,password:hashedPassword,role})
        await user.save()

        res.status(201).json({
            code:201,
            status:true,
            message:"user registerd successfully"})
    }catch(error){
        next(error)
        // res.status(400).json({error:err.message}
    }
}
const signin=async(req,res,next)=>{
    try{
        const {email,password}=req.body
        const user = await  User.findOne({ email })
        if(!user){
            res.code=401
            throw new Error("invalid credentials")
        }
        

        const isMatch=comparePassword(password,user.password)
        if (!isMatch){
            res.code=401
            throw new Error("iconrrect password !!")
        }
        res.status(200).json({code:200,status:true,message:"signed in successfully!!"})

    }catch(error){
        next(error)
    }
}
module.exports={signup,signin}