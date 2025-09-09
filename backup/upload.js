const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const generateCode = require("../utils/generateCode");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split('.').pop();
    const filename = originalName.replace(`.${extension}`, "");
    const compressedFileName = filename.split(" ").join("_");
    const lowerCaseFileName = compressedFileName.toLocaleLowerCase();
    const code = generateCode(12);
    return {
      folder: "uploads",
      public_id: `${lowerCaseFileName}_${code}`,
      resource_type: "auto",
      format: extension,
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const mimetype = file.mimetype;
    if (
      mimetype === "image/jpg" ||
      mimetype === "image/jpeg" ||
      mimetype === "image/png" ||
      mimetype === "application/pdf"
    ) {
      callback(null, true);
    } else {
      callback(new Error("only .jpg or .jpeg or .png or .pdf format is allowed"));
    }
  },
});

module.exports = upload;