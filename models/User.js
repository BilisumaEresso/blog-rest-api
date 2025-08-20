const mongoose= require("mongoose")
const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true,trim:true },
    password: { type: String, required: true },
    // role->1=superadmin,2=normal admin ,3=normal user
    role:{type:Number,default:3}
  },
  { timestamps: true }
);
const User=mongoose.model("User",userSchema)
module.exports=User;