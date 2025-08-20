const mongoose = require("mongoose");
const {connectionUrl}=require("../config/keys")
const connectMngoDb=async()=>{
    try{
       await mongoose.connect(connectionUrl)
       
        console.log("databse connected successfully")
    }catch(error){
        console.log(error.message)
    }
}
module.exports = connectMngoDb;
