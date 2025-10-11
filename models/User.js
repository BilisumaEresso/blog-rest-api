const mongoose= require("mongoose")
const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true,trim:true },
    password: { type: String, required: true },
    // role->1=superadmin,2=normal admin ,3=normal user
    role:{type:Number,default:3},
    verificationCode:String,
    isVerified:{type :Boolean, default:false},
    forgotPasswordCode:String,
    profilePic:{type:mongoose.Types.ObjectId ,ref:"file"}
  },
  { timestamps: true }
);
const User=mongoose.model("user",userSchema)
module.exports=User;