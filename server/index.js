const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { connection } = require("./database/db.js");
const {
    addUser,
    deleteUser,
    updateXY,
    addUserToBusy,
    deleteUserFromBusy,
    getAnActiveUser,
} = require("./controller/controller.js");
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
        console.log("room", room);
        await socket.join(room);
        await socket.emit("chat_room", room);

        //move both users from active to busy if it's the second user entering the room
        if(room!=userWithLocation.socketID){
            //2nd user who just entered the room
            await deleteUser({ socketID: user.socketID });
            await addUserToBusy(userWithLocation);
            //first user who is already in the room and has same socket id as the room name
            //first get the user from active user collection 
            const firstUser = await getAnActiveUser(room);
            console.log(firstUser);
            await deleteUser({ socketID: room });
            await addUserToBusy(firstUser);
        }
       
    });

    socket.on("message_send", (data) => {
        socket.to(data.room).emit("recieve_message", data.message);
        console.log(data);
    });

    socket.on("disconnect", () => {
        //delete user from either document if it exists upon disconnecting 
        deleteUser({ socketID: user.socketID });
        deleteUserFromBusy({ socketID: user.socketID });
        console.log("user disconnected", socket.id);
    });
});

server.listen(PORT, () => {
    console.log("Server running on", PORT);
});
