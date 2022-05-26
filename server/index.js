const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { connection } = require("./database/db.js");
const { addUser, deleteUser } = require("./controller/controller.js");

dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

app.use(cors);

const server = http.createServer(app);
connection(DB_USER, DB_PASS);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => { 
    const user = {
        socketID: socket.id,
    };

    addUser(user)
    

    socket.on("create_chat", (data) => {
        socket.join(data);
        console.log("Joined", data);
    });

    socket.on("disconnect", () => {
        deleteUser(user);
        console.log("user disconnected", socket.id);
    });
});

server.listen(PORT, () => {
    console.log("Server running on", PORT);
});
