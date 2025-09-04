const express=require("express")
const bodyParser=require("body-parser")
const dotenv=require("dotenv")
const morgan=require("morgan")
const {errorHandler}=require("./middlewares")

dotenv.config()
const connectMngoDb=require("./init/mongoDb")
connectMngoDb()
const {authRoute,categoryRoute}=require("./routes")
const notfound = require("./controller/notFound")

// init app
const app=express()
// third party middleware
app.use(express.json({limit:"500mb"}))
app.use(bodyParser.urlencoded({limit:"500mb",extended:true}))
// app.use(morgan("dev"));

// route section
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/category",categoryRoute)

// not found route
app.use(notfound)

// error handler
app.use(errorHandler)

module.exports=app