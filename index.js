const http=require("http")
const app=require("./app")
const {port}=require("./config/keys")

const PORT=port||5000

// create server
const server=http.createServer(app)


// listenning to server
server.listen(port,()=>{
    console.log(`running on server port ${PORT}`)
})