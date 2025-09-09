const path=require("path")
const {File}=require("../models")
const cloudinary = require("../config/cloudinary");
const {uploadToCloudinary,getSignedUrl}=require("../utils/cloudinary")
const generateCode=require("../utils/generateCode")
const {validateExtension} = require("../validators/file");
const { type } = require("os");
const uploadFile=async(req,res,next)=>{
    try{
        const {file}=req
        if(!file){
            res.code=400
            throw new Error("file not selected")
        }
        const ext=path.extname(file.originalname)
        const isValid=validateExtension(ext)
        if(!isValid){
            res.code=400
            throw new Error("only jpg or jpeg or png format is allowed")
        }
        
        const code = generateCode(12);
        const finalname = `${code}_${Date.now()}`;
         const result = await uploadToCloudinary(req.file.buffer,finalname, {
           folder: "uploads"
         });
         const newFile= new File({
            filename:file.originalname,
            // url:result.secure_url,
            public_id:result.public_id,
            format:result.format,
            size:file.size,
            uploadedBy:req.user._id
         })
         await newFile.save()

          res.json(newFile);
        
    }catch(error){
        next(error)
    }
}
const getFile = async (req, res, next) => {
  try {
    const { publicId } = req.query; // file reference stored in DB
    if (!publicId) {
      res.code = 400;
      throw new Error("Missing file reference");
    }
    const fileDoc = await File.findOne({ public_id: publicId });
    if (!fileDoc) {
      res.code = 404;
      throw new Error("File not found in database");
    }

    const signedUrl = getSignedUrl(publicId, 3600); // 1 hour valid
    res.status(200).json({
      code: 200,
      status: true,
      url: signedUrl,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { publicId } = req.query; // pass in route param
    if (!publicId) {
      res.code = 400;
      throw new Error("Missing file reference");
    }

    const result = await cloudinary.uploader.destroy(publicId,{
      invalidate:true,
      resource_type:"image"
    });

    if (result.result !== "ok") {
      res.code = 400;
      throw new Error("Failed to delete file");
    }
    await File.findOneAndDelete({public_id:publicId})

    res.status(200).json({
      code: 200,
      status: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports={uploadFile,getFile,deleteFile}