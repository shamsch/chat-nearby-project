const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

const PORT = 3001

app.use(cors)

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: "*"
    }
})

io.on("connection", (socket) =>{
    console.log(socket.id)
})

server.listen(PORT, () =>{
    console.log("Server running" )
})

