const http=require("http")
const app=require("./app")
const {port}=require("./config/keys")
const {connectMongo}=require("./init/mongoDb")

// create server
const server=http.createServer(app)
// connect databse

// listenning to server
server.listen(port,()=>{
    console.log(`running on server port ${port}`)
})