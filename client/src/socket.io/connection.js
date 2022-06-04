import io from "socket.io-client";

let SERVER_URL = "";

console.log("Node environment:", process.env.NODE_ENV)
if (process.env.NODE_ENV !== "production"){
    SERVER_URL = "http://localhost:3001/";
}

export const socket = io.connect(SERVER_URL);

