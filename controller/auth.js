const {User,File}=require("../models")
const hashPassword=require("../utils/hashPassword")
const comparePassword=require("../utils/comparePassword")
const generateToken=require("../utils/generateToken")
const generateCode=require("../utils/generateCode")
const sendEmail=require("../utils/sendEmail")
const { findById, removeListener } = require("../models/User")

const signup=async(req,res, next)=>{
    try{
        const {name,email,password,role}=req.body
        const emailExist=await User.findOne({email})
        if (emailExist){
           return res.status(400).json({
                code:400,
                status:false,
                message:"email already exist!! try to sign in"
            })
        
        }
        
        const hashedPassword=await hashPassword(password)
        const user=new User({name,email,password:hashedPassword,role})
        await user.save()
        
        const token = generateToken(user);
        res.status(201).json({
          code: 201,
          status: true,
          message: "user registered successfully",
          data: { token, user },
        });
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
            throw new Error("invalid credentials!!")
        }
        

        const isMatch=await comparePassword(password,user.password)
        if (!isMatch){
            res.code=401
            throw new Error("incorrect password !!")
        }
        const token = generateToken(user);
        res
          .status(200)
          .json({
            code: 200,
            status: true,
            message: "signed in successfully!!",
            data: { token, user }
          });

    }catch(error){
        next(error)
    }
}

const verifyCode=async(req,res,next)=>{
    try{
        const {email}=req.body
        const user=await User.findOne({email})
        if(!user){
            res.code=404
            throw Error("user not found")
        }
        if(user.isVerified){
            res.code=400
            throw Error("user already verified")
        }
        const code=generateCode(6)
        user.verificationCode=code
        // user.isVerified=true
        await user.save()

        // send email
       await sendEmail(
           {emailTo: user.email,
            subject:"email verification",
            code:user.verificationCode,
            content:"verify your email"}
        )

        res.status(200).json({code:200,status:true,message:"email verification sent successfully"})
        // verify user


    }catch(error){
        next(error)
    }
}

const verifyUser=async(req,res,next)=>{
    try{
        const {email,code}=req.body
        const user=await User.findOne({email})
        if(!user){
            res.code = 404;
            throw new Error("user not found");
        }
        if(user.verificationCode!==code){
            res.code=400
            throw new Error("invalid verification code");
            
        }

        user.isVerified=true
        user.verificationCode=undefined
        await user.save()
        res.status(201).json({code:201,status:true,message:"user verified successfully"})
    }catch(error){
        next(error)
    }
}



const forgotPassword=async(req,res,next)=>{
    try{
        const {email}=req.body
        const user=await User.findOne({email})
        if(!user){
            res.code=404
            throw new Error("user not found")
        }
        const code=generateCode(6)
        user.forgotPasswordCode=code
       await user.save()
        await sendEmail({
          emailTo: user.email,
          subject: "password reset code",
          code: user.forgotPasswordCode,
          content: "reset your password",
        });
        res.status(200).json({code:200,status:true,message:"forgot password code sent successfully"})

    }catch(error){
        next(error)
    }

}

const resetPassword =async (req, res, next) => {
  try {
    const {email,code,newPassword}=req.body
    const user=await User.findOne({email})
    if(!user){
        res.code=404
        throw new Error("user not found")
    }
    if(user.forgotPasswordCode!==code){
        res.code=400
        throw new Error("incorrect code")
    }
    const hashedNewPassword=await hashPassword(newPassword)
    user.password=hashedNewPassword
    user.forgotPasswordCode=null
    await user.save()
    res.status(200).json({code:200,status:true,message:"password reset successfully"})
  } catch (error) {
    next(error);
  }
};

const changePassword=async(req,res,next)=>{
    try{
        const {oldPassword,newPassword}=req.body
        const{_id}=req.user
        const user=await User.findById({_id})
        if(!user){
            res.code=404
            throw new Error("user not found")
        
        }
        const match= await comparePassword(oldPassword,user.password)
        if(!match ){
            res.code=400
            throw new Error("old password doesnt match")
        }
        if(oldPassword===newPassword){
            res.code=400
            throw new Error("old and new passwords are the same")
        }
        const hashedNewPassword=await hashPassword(newPassword)
        user.password=hashedNewPassword
        await user.save()
        res.status(200).json({code:200,status:true,message:"password changed successfully"})
    }catch(error){
        next(error)
    }
}

const updateProfile=async(req,res,next)=>{
    try{
        const {_id}=req.user
        const {name,email,profilePic}=req.body
        const user= await User.findById(_id).select("-password")
        if(!user){
            res.code=404
            throw new
           Error("user not found")
        }
        if(email){

            const userExist= await User.findOne({email})
            if(userExist&&userExist.email===email&&String(userExist._id)!==String(user._id)){
                res.code=400
                throw new Error("email already exists")
            }
        }
        if(profilePic){
            const file= await File.findById(profilePic)
            if(!file){
                res.code=404
                throw new Error("file not found")
            }
        }
        user.name=name?name:user.name
        user.email=email?email:user.email
        user.profilePic=profilePic
        if (email){
            user.isVerified=false
        }
        await user.save()
        res.status(200).json({
            code:200,
            status:true,
            message:"profile updated successfully",
            data:{user}
        })
    }catch(error){
        next(error)
    }
}

const currentUser=async(req,res,next)=>{
    try{
        const {_id}=req.user
        const user = await User.findById(_id).select("-password -isVerified -_id -verificationCode").populate("profilePic")
        if(!user){
            res.code=404
            throw new Error("user not found")
        
        }
        res.status(200).json({
            code:200,
            status:true,
            data:user
        })
    }catch(error){
        next(error)
    }
}

const addAdmin=async(req,res,next)=>{
    try{
        const {id}=req.params
        const user=await User.findById(id)
        console.log(user)
        if(user.role===1||user.role===2){
            res.code=400
            throw new Error("user is already an admin")
        }
        if (!user) {
          res.code = 400;
          throw new Error("user not found");
        }
        user.role=2
        await user.save()
        res.status(200).json({
            code:200,
            status:true,
            message:`You added ${user.name} as an admin`
        })
        console.log(user)

    }catch(error){
        next(error)
    }
}

const removeAdmin=async(req,res,next)=>{
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      console.log(user)
      if (!user) {
        res.code = 400;
        throw new Error("user not found");
      }
      if (user.role === 3) {
        res.code = 400;
        throw new Error("user is not an admin");
      }
      user.role = 1;
      await user.save();
      res.status(200).json({
        code: 200,
        status: true,
        message: `You removed ${user.name} from admin`,
      });
      console.log(user);
    } catch (error) {
      next(error);
    }
}

const searchUser=async(req,res,next)=>{
    try{
         const { q, page, limit, size } = req.query;
          const limitNumber = parseInt(size) || parseInt(limit) || 10;
          const pageNumber = parseInt(page) || 1;

          let query = {};
          if (q) {
            const search = RegExp(q, "i");
            query = { $or: [{ name: search }, { email: search }] };
          }
          const total = await User.countDocuments(query);
          const pages = Math.ceil(total / limitNumber);

          const user = await User.find(query)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
          code: 200,
          message: "got user list successfully",
          data: { total, pages, user },
        });

    }catch(error){

    }
}

module.exports={signup,signin,verifyCode,verifyUser,forgotPassword,resetPassword,changePassword,updateProfile,currentUser,addAdmin,removeAdmin,searchUser}