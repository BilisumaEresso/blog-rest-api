const jwt=require("jsonwebtoken")
const {jwt_secret}=require("../config/keys")
const isAuth=(req,res,next)=>{
    try{
        const authorization=req.headers.authorization? req.headers.authorization.split(" ") :[]
        const token= authorization.length>1 ? authorization[1]:null
        if(token){
            const payload= jwt.verify(token,jwt_secret)
            if (payload) {
              req.user = {
                _id: payload.id,
                email: payload.email,
                name: payload.name,
                role: payload.role,
              };
            } else {
              res.code = 400;
              throw new Error("Unauthorized");
            }
        }else{
            res.code=400
            throw new Error("token is required")
        }
    
        next()
    }catch(error){
        next(error)
    }
}

module.exports=isAuth