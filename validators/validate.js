const {validationResult}=require("express-validator")

const validate=(req,res,next)=>{
    const errors=validationResult(req)
    const mappedError={}

    if (Object.keys(errors.errors).length==0){
        next()
    }else{
        errors.errors.map((error)=>{
            mappedError[error.path]=error.msg

        })
        res.status(400).json(mappedError)
    }

    
    
}

module.exports=validate