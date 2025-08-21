
const bcrypt=require("bcrypt")

const comparePassword=(password,hashedPassword)=>{
  return  bcrypt.compare(password,hashedPassword)
}

module.exports=comparePassword