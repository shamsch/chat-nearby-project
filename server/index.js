const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { connection } = require("./database/db.js");
const { addUser, deleteUser, updateXY } = require("./controller/controller.js");
const { findAvailableUser } = require("./logic/findAvailableUser.js");

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
        x: "0",
        y: "0",
    };

    addUser(user);

    socket.on("create_chat", async (data) => {
        const userWithLocation = {
            ...user,
            ...data,
        };
        await updateXY(user, userWithLocation);
        const userNearBy = await findAvailableUser(userWithLocation);

        const room = userNearBy.length
            ? userNearBy[0].socketID
            : userWithLocation.socketID;
        console.log("room", room)
        socket.join(room);
        await socket.emit("chat_room", room);
    });

    socket.on("message_send", (data) => {
        socket.to().emit("recieve_message", data);
        console.log(data);
    });

    socket.on("disconnect", () => {
        deleteUser({ socketID: user.socketID });
        console.log("user disconnected", socket.id);
    });
});

server.listen(PORT, () => {
    console.log("Server running on", PORT);
});
