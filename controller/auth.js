const User=require("../models")

const signup=async(req,res, next)=>{
    try{
        const {username,email,password,role}=req.body
        const user=new User({username,email,password,role})
        await user.save()

        res.status(201).json({
            code:201,
            status:true,
            message:"user registerd successfully"})
    }catch(error){
        next(error)
        // res.status(400).json({error:err.message})
    }
}
module.exports={signup}