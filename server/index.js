const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { connection } = require("./database/db.js");


//events
const { createChat } = require("./event/createChat.js");
const { messageSend } = require("./event/messageSend.js");
const { onConnection } = require("./event/onConnection.js");
const { onTyping } = require("./event/onTyping.js");
const { onDisconnect } = require("./event/onDisconnect.js");

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

let userCount = 0;

io.on("connection", (socket) => {
	const { user, newUserCount } = onConnection(socket, userCount);

	userCount = newUserCount;
	io.emit("user_count", userCount);

	socket.on("create_chat", (data) => createChat(socket, data, user));

	socket.on("message_send", (data) => messageSend(io, data));

	socket.on("self_typing", (data) => onTyping(io, data));

	socket.on("disconnect", () => {
		userCount = onDisconnect(io, socket, user, userCount);
        io.emit("user_count", userCount);
	});
});

server.listen(PORT, () => {
	console.log("Server running on", PORT);
});
