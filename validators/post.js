const {check}=require("express-validator")
const { default: mongoose } = require("mongoose")

const addPostValidator=[
    check("title").notEmpty().withMessage("title required"),
    check("file").custom(async(file)=>{
        if(file&&!mongoose.Types.ObjectId.isValid(file)){
            throw "invalid file id"
        }
    }),
    check("category").notEmpty().withMessage("category required").custom(async(category)=>{
        if(!mongoose.Types.ObjectId.isValid(category)){
            throw "invalid category id"
        }
    })
]
const updatePostValidator = [
  check("file").custom(async (file) => {
    if (file && !mongoose.Types.ObjectId.isValid(file)) {
      throw "invalid file id";
    }
  }),
  check("category").custom(async (category) => {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw "invalid category id";
    }
  }),
  check("postId")
    .notEmpty()
    .withMessage("postId required")
    .custom(async (postId) => {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw "invalid post id";
      }
    }),
    
];
const deletePostValidator = [
  check("postId")
    .notEmpty()
    .withMessage("postId required")
    .custom(async (postId) => {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw "invalid post id";
      }
    }),
];
const detailPostValidator = [
  check("postId")
    .notEmpty()
    .withMessage("postId required")
    .custom(async (postId) => {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw "invalid post id";
      }
    }),
];
module.exports={addPostValidator,updatePostValidator,deletePostValidator,detailPostValidator}