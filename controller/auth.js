const User=require("../models")
const hashPassword=require("../utils/hashPassword")

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
        // if(!username){
        //     res.code=400
        //     throw new Error("name is required")
        // }
        // if(!email){
        //     res.code=400
        //     throw new Error("email required")
        // }
        //  if (!password) {
        //    res.code = 400;
        //    throw new Error("password required");
        //  }
        //   if (password.length<6) {
        //     res.code = 400;
        //     throw new Error("passsword is too short, must be longer 6 character");
        //   }
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
module.exports={signup}