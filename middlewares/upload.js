const multer=require("multer")
const path =require("path")
const generateCode=require("../utils/generateCode")

const storage =multer.diskStorage({
    destination:(req,File,callback)=>{
        callback(null,"./uploads")
    },
    filename:(req,file,callback)=>{
        const originalName=file.originalname
        const extension=path.extname(originalName)
        const filename=originalName.replace(extension,"")
        const compresedFileName=filename.split(" ").join("_")
        const lowerCaseFileName=compresedFileName.toLocaleLowerCase()
        const code=generateCode(12)
        const finalName=`${lowerCaseFileName}_${code}${extension}`
        callback(null,finalName)
    },
    
})
const upload = multer({
  storage,
  fileFilter:(req,file,callback)=>{
    const mimetype=file.mimetype
    if(mimetype==="image/jpg"||mimetype==="image/jpeg"||mimetype==="image/png"||mimetype==="application/pdf"){
        callback(null,file)
    }else{
        callback(new Error("only .jpg or .jpeg or .png or .pdf format is allowed"))
    }
  }
});

module.exports=upload